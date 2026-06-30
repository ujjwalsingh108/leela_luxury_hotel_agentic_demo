import { chromium } from "playwright";
import { promises as fs } from "node:fs";
import path from "node:path";

const email = process.env.ASSISTENTS_EMAIL;
const password = process.env.ASSISTENTS_PASSWORD;
const origin = "https://internal-workflow.assistents.ai";
const outDir = path.resolve("metadata", "assistents-ai");

async function login(page) {
  await page.goto(`${origin}/login`, { waitUntil: "networkidle", timeout: 60000 });
  await page.getByPlaceholder("Email or Username").fill(email);
  await page.locator("input[name='password'], input[type='password']").first().fill(password);
  await page.locator("button[type='submit'], button").filter({ hasText: /sign in|submit/i }).first().click();
  await page.waitForURL((url) => !url.pathname.includes("login"), { timeout: 30000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
}

async function getAuthHeaders(page) {
  const storage = await page.evaluate(() => {
    const values = {};
    for (const key of Object.keys(window.localStorage)) {
      values[key] = window.localStorage.getItem(key);
    }
    return values;
  });

  const serialized = JSON.stringify(storage);
  const tokenMatch = serialized.match(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/);
  return tokenMatch ? { Authorization: `Bearer ${tokenMatch[0]}` } : {};
}

async function getJson(page, url, headers = {}) {
  try {
    const response = await page.request.get(url, { timeout: 20000, headers });
    const text = await response.text();
    let body = text;
    try {
      body = JSON.parse(text);
    } catch {
      body = text.slice(0, 500);
    }
    return { ok: response.ok(), status: response.status(), url, body };
  } catch (error) {
    return { ok: false, status: 0, url, error: error.message };
  }
}

async function collectRoute(page, route) {
  await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  const name = route.replace(/^\//, "").replaceAll("/", "-") || "home";
  const screenshot = path.join(outDir, `route-${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true }).catch(() => {});

  return {
    route,
    url: page.url(),
    screenshot,
    headings: await page.locator("h1,h2,h3").evaluateAll((nodes) => nodes.map((node) => node.innerText.trim()).filter(Boolean)).catch(() => []),
    buttons: await page.locator("button").evaluateAll((nodes) => nodes.map((node) => node.innerText.trim()).filter(Boolean).slice(0, 40)).catch(() => []),
    inputs: await page.locator("input, textarea, select").evaluateAll((nodes) => nodes.map((node) => ({
      tag: node.tagName.toLowerCase(),
      type: node.getAttribute("type") || "",
      name: node.getAttribute("name") || "",
      placeholder: node.getAttribute("placeholder") || "",
      value: node.tagName === "SELECT" ? "" : "",
    })).slice(0, 60)).catch(() => []),
    text: await page.locator("main, body").first().innerText({ timeout: 5000 }).catch(() => ""),
  };
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
  const page = await context.newPage();
  await login(page);
  const authHeaders = await getAuthHeaders(page);

  const organizations = await getJson(page, `${origin}/api/organizations`, authHeaders);
  const orgId = organizations.body?.[0]?.id || organizations.body?.organizations?.[0]?.id;
  const workspaces = orgId ? await getJson(page, `${origin}/api/organizations/${orgId}/workspaces`, authHeaders) : null;
  const workspaceList = Array.isArray(workspaces?.body) ? workspaces.body : workspaces?.body?.workspaces || [];
  const selectedWorkspace = workspaceList.find((workspace) => workspace.name === "WhiteGlove AI") || workspaceList[0];
  const workspaceId = selectedWorkspace?.id;
  const agents = workspaceId ? await getJson(page, `${origin}/api/agents?workspaceId=${workspaceId}`, authHeaders) : null;
  const agentId = agents?.body?.[0]?.id || agents?.body?.agents?.[0]?.id || "26dc79ac-422a-4486-9492-29bf2daa6a99";

  const endpoints = [
    `${origin}/api/organizations`,
    orgId && `${origin}/api/organizations/${orgId}/workspaces`,
    workspaceId && `${origin}/api/agents?workspaceId=${workspaceId}`,
    agentId && `${origin}/api/agents/${agentId}`,
    workspaceId && `${origin}/api/history?limit=20&workspaceId=${workspaceId}`,
    workspaceId && `${origin}/api/workflows?workspaceId=${workspaceId}`,
    workspaceId && `${origin}/api/channels?workspaceId=${workspaceId}`,
    workspaceId && `${origin}/api/rules?workspaceId=${workspaceId}`,
    workspaceId && `${origin}/api/tables?workspaceId=${workspaceId}`,
    workspaceId && `${origin}/api/knowledgebase/documents?workspaceId=${workspaceId}`,
    workspaceId && `${origin}/api/prompts?workspaceId=${workspaceId}`,
    workspaceId && `${origin}/api/agents/prompts?workspaceId=${workspaceId}`,
  ].filter(Boolean);

  const api = [];
  for (const endpoint of endpoints) {
    api.push(await getJson(page, endpoint, authHeaders));
  }

  const routes = [];
  for (const route of [
    "/",
    "/workflow",
    "/agents",
    `/agents/${agentId}/edit`,
    "/agents/prompts",
    "/agents/runs",
    "/channels",
    "/rules",
    "/datacenter/tables",
    "/datacenter/sql-editor",
    "/datacenter/datasources",
    "/knowledgebase/documents",
  ]) {
    routes.push(await collectRoute(page, route));
  }

  await fs.writeFile(path.join(outDir, "api-and-routes.json"), JSON.stringify({
    capturedAt: new Date().toISOString(),
    orgId,
    workspaceId,
    agentId,
    hasBearerToken: Boolean(authHeaders.Authorization),
    api,
    routes,
  }, null, 2));

  await browser.close();
  console.log(`Wrote ${path.join(outDir, "api-and-routes.json")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
