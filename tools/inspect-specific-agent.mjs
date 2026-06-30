import { chromium } from "playwright";
import { promises as fs } from "node:fs";
import path from "node:path";

const email = process.env.ASSISTENTS_EMAIL;
const password = process.env.ASSISTENTS_PASSWORD;
const agentUrl = process.env.ASSISTENTS_AGENT_URL;
const outDir = path.resolve("metadata", "assistents-ai", "specific-agent");

if (!email || !password || !agentUrl) {
  console.error("Set ASSISTENTS_EMAIL, ASSISTENTS_PASSWORD, and ASSISTENTS_AGENT_URL.");
  process.exit(1);
}

async function loginIfNeeded(page) {
  const emailInput = page.getByPlaceholder("Email or Username").first();
  if (!(await emailInput.isVisible({ timeout: 7000 }).catch(() => false))) {
    return;
  }

  await emailInput.fill(email);
  await page.locator("input[type='password'], input[name='password']").first().fill(password);
  await page.locator("button[type='submit'], button").filter({ hasText: /sign in|submit/i }).first().click();
  await page.waitForURL((url) => !url.pathname.includes("login"), { timeout: 30000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
}

async function collect(page, name) {
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true }).catch(() => {});

  return {
    name,
    url: page.url(),
    title: await page.title().catch(() => ""),
    headings: await page.locator("h1,h2,h3").evaluateAll((nodes) => nodes.map((node) => node.innerText.trim()).filter(Boolean)).catch(() => []),
    buttons: await page.locator("button").evaluateAll((nodes) => nodes.map((node) => node.innerText.trim()).filter(Boolean)).catch(() => []),
    inputs: await page.locator("input, textarea, select").evaluateAll((nodes) => nodes.map((node) => ({
      tag: node.tagName.toLowerCase(),
      type: node.getAttribute("type") || "",
      name: node.getAttribute("name") || "",
      placeholder: node.getAttribute("placeholder") || "",
      value: node.tagName === "TEXTAREA" ? node.value.slice(0, 400) : node.value?.slice(0, 200),
    }))).catch(() => []),
    text: await page.locator("body").innerText({ timeout: 6000 }).catch(() => ""),
  };
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto(agentUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await loginIfNeeded(page);
  await page.goto(agentUrl, { waitUntil: "networkidle", timeout: 60000 });

  const pages = [await collect(page, "agent-edit")];
  const tabs = [
    "Tools",
    "Outbound API Integrations",
    "Authentication",
    "Web Embedding",
    "Agent API Access",
    "Channels",
  ];

  for (const tab of tabs) {
    const button = page.getByRole("button", { name: tab }).first();
    if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
      await button.scrollIntoViewIfNeeded().catch(() => {});
      await button.click().catch(() => {});
      await page.waitForTimeout(1000);
      pages.push(await collect(page, tab.toLowerCase().replaceAll(" ", "-")));
    }
  }

  await fs.writeFile(path.join(outDir, "inspection.json"), JSON.stringify({ capturedAt: new Date().toISOString(), agentUrl, pages }, null, 2));
  await browser.close();
  console.log(`Wrote ${path.join(outDir, "inspection.json")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
