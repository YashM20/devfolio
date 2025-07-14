import fs from "node:fs";
import path from "node:path";

import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";

const getChromePath = () => {
  switch (process.platform) {
    case "win32":
      return [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      ].find(path => {
        try {
          return fs.existsSync(path);
        } catch {
          return false;
        }
      }) || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    case "darwin":
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    case "linux":
      return "/usr/bin/google-chrome";
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
};

const executablePath = getChromePath();
const url = process.env.URL || "http://localhost:1408";
const outputDir = path.join(process.cwd(), ".ncdai/screenshots");

const SIZE = {
  // Full HD
  desktop: {
    width: 1920,
    height: 1080,
  },
  // iPhone 16 Pro Max
  mobile: {
    width: 440,
    height: 956,
  },
  // Open Graph image size
  "og-image": {
    width: 1200,
    height: 630,
  },
} as const;

type Theme = "light" | "dark";

async function captureScreenshot({
  browser,
  url,
  size,
  themes = ["light"],
  type = "webp",
}: {
  browser: Browser;
  url: string;
  size: keyof typeof SIZE;
  themes?: Theme[];
  type?: "webp" | "png" | "jpeg";
}) {
  // Ensure the output directory exists
  await fs.promises.mkdir(outputDir, { recursive: true });

  const page = await browser.newPage();

  const { width, height } = SIZE[size];
  await page.setViewport({ width, height });

  await page.goto(url, { waitUntil: "networkidle2" });

  for (const theme of themes) {
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: theme },
    ]);

    const filePath = path.join(
      outputDir,
      `screenshot-${size}-${theme}.${type}`
    ) as `${string}.webp` | `${string}.png` | `${string}.jpeg`;

    await page.screenshot({
      path: filePath,
      type,
      quality: type !== "png" ? 90 : undefined,
    });

    console.log(`✅ Screenshot saved:`, filePath);
  }

  await page.close();
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath,
  });

  try {
    await captureScreenshot({
      browser,
      url,
      size: "desktop",
      themes: ["light", "dark"],
    });

    await captureScreenshot({
      browser,
      url,
      size: "mobile",
      themes: ["light", "dark"],
    });

    await captureScreenshot({
      browser,
      url,
      size: "og-image",
      themes: ["dark"],
      type: "png",
    });

    console.log("✅ All screenshots captured successfully.");
  } catch (error) {
    console.error("⛔️ Error capturing screenshots:", error);
  } finally {
    await browser.close();
  }
}

main();
