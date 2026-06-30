import { chromium } from "playwright";
import { promises as fs } from "node:fs";
import path from "node:path";

const email = process.env.ASSISTENTS_EMAIL;
const password = process.env.ASSISTENTS_PASSWORD;
const origin = "https://internal-workflow.assistents.ai";
const agentId = "26dc79ac-422a-4486-9492-29bf2daa6a99";
const outDir = path.resolve("metadata", "assistents-ai", "agent-tabs");

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto(`${origin}/login`, { waitUntil: "networkidle", timeout: 60000 });
  await page.getByPlaceholder("Email or Username").fill(email);
  await page.locator("input[name='password'], input[type='password']").first().fill(password);
  await page.locator("button[type='submit'], button").filter({ hasText: /sign in|submit/i }).first().click();
  await page.waitForURL((url) => !url.pathname.includes("login"), { timeout: 30000 }).catch(() => {});

  await page.goto(`${origin}/agents/${agentId}/edit`, { waitUntil: "networkidle", timeout: 60000 });

  const tabs = [
    "Basic Information",
    "Tools",
    "Outbound API Integrations",
    "Authentication",
    "Conversation Starters",
    "Knowledge Base",
    "Direct URL Access",
    "Web Embedding",
    "Channels",
    "Agent API Access",
    "Smart Dock",
  ];

  const results = [];
  for (const tab of tabs) {
    const button = page.getByRole("button", { name: tab }).first();
    if (await button.isVisible({ timeout: 4000 }).catch(() => false)) {
      await button.scrollIntoViewIfNeeded().catch(() => {});
      await button.click();
      await page.waitForTimeout(800);
      const safeName = tab.toLowerCase().replaceAll(" ", "-");
      const screenshot = path.join(outDir, `${safeName}.png`);
      await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});
      const text = await page.locator("main, body").first().innerText({ timeout: 5000 }).catch(() => "");
      const inputs = await page.locator("input, textarea, select").evaluateAll((nodes) => nodes.map((node) => ({
        tag: node.tagName.toLowerCase(),
        type: node.getAttribute("type") || "",
        name: node.getAttribute("name") || "",
        placeholder: node.getAttribute("placeholder") || "",
        value: node.tagName === "TEXTAREA" ? node.value.slice(0, 500) : node.value?.slice(0, 300),
      }))).catch(() => []);
      results.push({ tab, screenshot, text, inputs });
    }
  }

  await fs.writeFile(path.join(outDir, "tabs.json"), JSON.stringify(results, null, 2));
  await browser.close();
  console.log(`Wrote ${path.join(outDir, "tabs.json")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
