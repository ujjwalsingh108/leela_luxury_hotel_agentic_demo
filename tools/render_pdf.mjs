import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error("Usage: node tools/render_pdf.mjs <input.html> <output.pdf>");
  process.exit(1);
}

const inputPath = path.resolve(input);
const outputPath = path.resolve(output);
const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    viewport: { width: 1240, height: 1754 },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(inputPath).href, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    preferCSSPageSize: true,
  });
} finally {
  await browser.close();
}
