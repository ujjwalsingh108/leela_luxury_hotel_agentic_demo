import { chromium } from "playwright";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const startUrl = process.argv[2] || "https://www.theleela.com/";
const outputDir = path.resolve(process.argv[3] || "theleela_playwright_site");
const assetsDir = path.join(outputDir, "_assets");

const assetMap = new Map();
const cssAssets = new Set();
const pendingWrites = [];

const extensionByType = new Map([
  ["text/css", ".css"],
  ["text/javascript", ".js"],
  ["application/javascript", ".js"],
  ["application/x-javascript", ".js"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/gif", ".gif"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
  ["image/avif", ".avif"],
  ["font/woff", ".woff"],
  ["font/woff2", ".woff2"],
  ["application/font-woff", ".woff"],
  ["application/font-woff2", ".woff2"],
  ["application/vnd.ms-fontobject", ".eot"],
  ["font/ttf", ".ttf"],
  ["font/otf", ".otf"],
  ["video/mp4", ".mp4"],
]);

function isHttpUrl(value) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function guessExtension(url, contentType) {
  const mediaType = (contentType || "").split(";")[0].trim().toLowerCase();
  if (extensionByType.has(mediaType)) {
    return extensionByType.get(mediaType);
  }

  const parsed = new URL(url);
  const ext = path.extname(parsed.pathname);
  return ext && ext.length <= 8 ? ext : ".bin";
}

function assetFileFor(url, contentType) {
  const parsed = new URL(url);
  const host = parsed.hostname.replace(/^www\./, "").replace(/[^a-z0-9.-]/gi, "_");
  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 12);
  const basename = path.basename(parsed.pathname).replace(/[^a-z0-9._-]/gi, "_") || "asset";
  const trimmed = basename.replace(/\.[a-z0-9]+$/i, "");
  const ext = guessExtension(url, contentType);
  return `${host}-${trimmed}-${hash}${ext}`;
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function htmlEscapeUrl(value) {
  return value.replaceAll("&", "&amp;");
}

async function saveAsset(response) {
  const request = response.request();
  const resourceType = request.resourceType();
  const url = response.url();

  if (!isHttpUrl(url) || response.status() >= 400) {
    return;
  }

  const shouldSave = ["stylesheet", "script", "image", "font", "media"].includes(resourceType);
  if (!shouldSave || assetMap.has(url)) {
    return;
  }

  try {
    const contentType = response.headers()["content-type"] || "";
    const body = await response.body();
    await writeAsset(url, contentType, body, resourceType);
  } catch {
    assetMap.delete(url);
  }
}

async function writeAsset(url, contentType, body, resourceType = "") {
  const filename = assetFileFor(url, contentType);
  const absolutePath = path.join(assetsDir, filename);
  const relativePath = toPosix(path.relative(outputDir, absolutePath));

  assetMap.set(url, relativePath);
  if (resourceType === "stylesheet" || contentType.includes("text/css")) {
    cssAssets.add(absolutePath);
  }

  await fs.writeFile(absolutePath, body);
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const distance = 650;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        total += distance;

        if (total >= document.body.scrollHeight - window.innerHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 120);
    });
  });
}

async function acceptCookiesIfPresent(page) {
  const acceptButtons = [
    "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
    "#CybotCookiebotDialogBodyButtonAccept",
    "button:has-text('Allow all')",
    "button:has-text('Accept')",
  ];

  for (const selector of acceptButtons) {
    const button = page.locator(selector).first();
    if (await button.isVisible({ timeout: 1200 }).catch(() => false)) {
      await button.click({ timeout: 3000 }).catch(() => {});
      return;
    }
  }
}

async function collectDomAssetUrls(page) {
  return page.evaluate(() => {
    const urls = new Set();
    const assetLinkRels = new Set(["stylesheet", "preload", "modulepreload", "icon", "apple-touch-icon"]);

    const addUrl = (value) => {
      if (!value || value.startsWith("data:") || value.startsWith("blob:") || value.startsWith("javascript:")) {
        return;
      }

      try {
        urls.add(new URL(value, window.location.href).href);
      } catch {
        // Ignore malformed third-party values.
      }
    };

    const addSrcset = (value) => {
      if (!value) {
        return;
      }

      value.split(",").forEach((candidate) => {
        addUrl(candidate.trim().split(/\s+/)[0]);
      });
    };

    document.querySelectorAll("img[src], script[src], video[src], audio[src], source[src], iframe[src]").forEach((element) => {
      addUrl(element.getAttribute("src"));
    });

    document.querySelectorAll("img[srcset], source[srcset]").forEach((element) => {
      addSrcset(element.getAttribute("srcset"));
    });

    document.querySelectorAll("[poster], [data-src], [data-lazy-src], [data-original]").forEach((element) => {
      addUrl(element.getAttribute("poster"));
      addUrl(element.getAttribute("data-src"));
      addUrl(element.getAttribute("data-lazy-src"));
      addUrl(element.getAttribute("data-original"));
    });

    document.querySelectorAll("[data-srcset], [data-lazy-srcset]").forEach((element) => {
      addSrcset(element.getAttribute("data-srcset"));
      addSrcset(element.getAttribute("data-lazy-srcset"));
    });

    document.querySelectorAll("link[href]").forEach((element) => {
      const rel = (element.getAttribute("rel") || "").toLowerCase();
      const as = (element.getAttribute("as") || "").toLowerCase();
      const usefulRel = rel.split(/\s+/).some((token) => assetLinkRels.has(token));
      const usefulPreload = rel.includes("preload") && ["image", "font", "style", "script"].includes(as);

      if (usefulRel || usefulPreload) {
        addUrl(element.getAttribute("href"));
      }
    });

    return [...urls].filter((url) => url.startsWith("http://") || url.startsWith("https://"));
  });
}

async function saveMissingDomAssets(page) {
  const urls = await collectDomAssetUrls(page);

  for (const url of urls) {
    if (assetMap.has(url)) {
      continue;
    }

    try {
      const response = await page.request.get(url, { timeout: 30000 });
      if (!response.ok()) {
        continue;
      }

      const contentType = response.headers()["content-type"] || "";
      const body = await response.body();
      await writeAsset(url, contentType, body);
    } catch {
      // Best effort: keep the page usable even if a lazy asset no longer responds.
    }
  }
}

async function rewriteDomAssetUrls(page) {
  const plainMap = Object.fromEntries(assetMap);

  await page.evaluate((assets) => {
    const resolveUrl = (value) => {
      try {
        return new URL(value, window.location.href).href;
      } catch {
        return null;
      }
    };

    const rewriteAttr = (element, attr) => {
      const value = element.getAttribute(attr);
      if (!value) {
        return;
      }

      const resolved = resolveUrl(value);
      if (resolved && assets[resolved]) {
        element.setAttribute(attr, assets[resolved]);
      }
    };

    const rewriteSrcset = (element, attr = "srcset") => {
      const value = element.getAttribute(attr);
      if (!value) {
        return;
      }

      const rewritten = value
        .split(",")
        .map((candidate) => {
          const parts = candidate.trim().split(/\s+/);
          const resolved = resolveUrl(parts[0]);
          if (resolved && assets[resolved]) {
            parts[0] = assets[resolved];
          }
          return parts.join(" ");
        })
        .join(", ");

      element.setAttribute(attr, rewritten);
    };

    document.querySelectorAll("[src]").forEach((element) => rewriteAttr(element, "src"));
    document.querySelectorAll("[href]").forEach((element) => rewriteAttr(element, "href"));
    document.querySelectorAll("[poster]").forEach((element) => rewriteAttr(element, "poster"));
    document.querySelectorAll("[data-src]").forEach((element) => rewriteAttr(element, "data-src"));
    document.querySelectorAll("[data-lazy-src]").forEach((element) => rewriteAttr(element, "data-lazy-src"));
    document.querySelectorAll("[data-original]").forEach((element) => rewriteAttr(element, "data-original"));
    document.querySelectorAll("[srcset]").forEach((element) => rewriteSrcset(element, "srcset"));
    document.querySelectorAll("[data-srcset]").forEach((element) => rewriteSrcset(element, "data-srcset"));
    document.querySelectorAll("[data-lazy-srcset]").forEach((element) => rewriteSrcset(element, "data-lazy-srcset"));

    document.querySelectorAll("script").forEach((element) => {
      if (!element.src) {
        element.remove();
      }
    });
  }, plainMap);
}

async function cleanupCapturedDom(page) {
  await page.evaluate(() => {
    document
      .querySelectorAll([
        "#CybotCookiebotDialog",
        "#CookiebotWidget",
        ".CybotCookiebotOffscreenIframe",
        "script#Cookiebot",
        "script[src*='cookiebot']",
        "script[src*='consent.cookiebot']",
      ].join(","))
      .forEach((element) => element.remove());

    document.documentElement.classList.remove("leela-cmp-gated");
    document.body?.classList.remove("leela-cmp-gated");
  });
}

async function rewriteCssAssetUrls() {
  const replacements = [...assetMap.entries()];

  for (const cssPath of cssAssets) {
    let css = await fs.readFile(cssPath, "utf8");
    const cssDir = path.dirname(cssPath);

    for (const [url, localPath] of replacements) {
      const cssRelativePath = toPosix(path.relative(cssDir, path.join(outputDir, localPath)));
      css = css.replace(new RegExp(escapeRegExp(url), "g"), cssRelativePath);
      css = css.replace(new RegExp(escapeRegExp(htmlEscapeUrl(url)), "g"), cssRelativePath);
    }

    await fs.writeFile(cssPath, css);
  }
}

async function main() {
  await fs.mkdir(assetsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  page.on("response", (response) => {
    pendingWrites.push(saveAsset(response));
  });

  await page.goto(startUrl, { waitUntil: "networkidle", timeout: 90000 });
  await acceptCookiesIfPresent(page);
  await autoScroll(page);
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  await Promise.allSettled(pendingWrites);
  await saveMissingDomAssets(page);

  await rewriteDomAssetUrls(page);
  await cleanupCapturedDom(page);
  const content = await page.content();
  await fs.writeFile(path.join(outputDir, "index.html"), content);
  await rewriteCssAssetUrls();

  await browser.close();

  console.log(`Saved ${assetMap.size} assets`);
  console.log(`Local site: ${path.join(outputDir, "index.html")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
