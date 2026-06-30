import { chromium } from "playwright";
import { promises as fs } from "node:fs";
import path from "node:path";

const email = process.env.ASSISTENTS_EMAIL;
const password = process.env.ASSISTENTS_PASSWORD;
const baseUrl = process.env.ASSISTENTS_URL || "https://internal-workflow.assistents.ai/workflow";
const outDir = path.resolve("metadata", "assistents-ai");

if (!email || !password) {
  console.error("Set ASSISTENTS_EMAIL and ASSISTENTS_PASSWORD.");
  process.exit(1);
}

async function safeText(page) {
  return page.evaluate(() => {
    const ignored = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);
    return [...document.body.querySelectorAll("body *")]
      .filter((node) => !ignored.has(node.tagName))
      .map((node) => node.innerText?.trim())
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index)
      .slice(0, 120);
  });
}

async function collectPage(page, name) {
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  const screenshot = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});

  return {
    name,
    url: page.url(),
    title: await page.title().catch(() => ""),
    headings: await page.locator("h1,h2,h3").evaluateAll((nodes) => nodes.map((node) => node.innerText.trim()).filter(Boolean)).catch(() => []),
    buttons: await page.locator("button").evaluateAll((nodes) => nodes.map((node) => node.innerText.trim()).filter(Boolean)).catch(() => []),
    links: await page.locator("a").evaluateAll((nodes) => nodes.map((node) => ({ text: node.innerText.trim(), href: node.href })).filter((item) => item.text || item.href)).catch(() => []),
    inputs: await page.locator("input, textarea, select").evaluateAll((nodes) =>
      nodes.map((node) => ({
        tag: node.tagName.toLowerCase(),
        type: node.getAttribute("type") || "",
        name: node.getAttribute("name") || "",
        placeholder: node.getAttribute("placeholder") || "",
        aria: node.getAttribute("aria-label") || "",
      })),
    ).catch(() => []),
    visibleText: await safeText(page).catch(() => []),
    screenshot,
  };
}

async function clickByText(page, text) {
  const target = page.getByText(text, { exact: false }).first();
  if (await target.isVisible({ timeout: 3500 }).catch(() => false)) {
    await target.click();
    await page.waitForTimeout(800);
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    return true;
  }
  return false;
}

async function loginIfNeeded(page) {
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

  const emailByPlaceholder = page.getByPlaceholder("Email or Username").first();
  const emailByName = page.locator("input[name='email']").first();
  const emailInput = await emailByPlaceholder.isVisible({ timeout: 5000 }).catch(() => false)
    ? emailByPlaceholder
    : emailByName;

  if (!(await emailInput.isVisible({ timeout: 3000 }).catch(() => false))) {
    return false;
  }

  await emailInput.fill(email);
  await page.locator("input[name='password'], input[type='password']").first().fill(password);

  const submit = page.locator("button[type='submit'], button").filter({ hasText: /sign in|submit/i }).first();
  if (await submit.isVisible({ timeout: 3000 }).catch(() => false)) {
    await submit.click();
  } else {
    await page.keyboard.press("Enter");
  }

  await page.waitForURL((url) => !url.pathname.includes("login"), { timeout: 30000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
  await page.getByText("Workflows", { exact: false }).first().waitFor({ timeout: 15000 }).catch(() => {});

  return true;
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const apiCalls = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  page.on("response", (response) => {
    const url = response.url();
    if (url.includes("internal-workflow.assistents.ai") || url.includes("/api/")) {
      apiCalls.push({
        status: response.status(),
        method: response.request().method(),
        url,
        resourceType: response.request().resourceType(),
      });
    }
  });

  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await loginIfNeeded(page);

  const pages = [];
  pages.push(await collectPage(page, "workflow-home"));

  for (const item of [
    "Manage Agents",
    "The Leela Royal",
    "Manage Prompts",
    "Agent Runs",
    "Rules",
    "All Workflows",
    "New Workflow",
    "Workflow Runs",
    "Tasks",
    "Channels",
    "Tables",
  ]) {
    const clicked = await clickByText(page, item);
    if (clicked) {
      pages.push(await collectPage(page, item.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-")));
    }
  }

  const storage = await page.evaluate(() => ({
    localStorageKeys: Object.keys(window.localStorage),
    sessionStorageKeys: Object.keys(window.sessionStorage),
  })).catch(() => ({ localStorageKeys: [], sessionStorageKeys: [] }));

  await fs.writeFile(path.join(outDir, "inspection.json"), JSON.stringify({
    capturedAt: new Date().toISOString(),
    baseUrl,
    pages,
    apiCalls: apiCalls.slice(-250),
    storage,
  }, null, 2));

  await browser.close();
  console.log(`Wrote ${path.join(outDir, "inspection.json")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
