import fs from "node:fs";
import path from "node:path";

import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";

const getChromePath = () => {
  switch (process.platform) {
    case "win32":
      return (
        [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
        ].find((path) => {
          try {
            return fs.existsSync(path);
          } catch {
            return false;
          }
        }) || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      );
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
const outputDir = path.join(process.cwd(), "public/images/ss");
const oldDir = path.join(outputDir, "old");

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

async function moveOldScreenshots() {
  // Create old directory if it doesn't exist
  await fs.promises.mkdir(oldDir, { recursive: true });

  // Get all files in the ss directory
  const files = await fs.promises.readdir(outputDir);

  // Move screenshot files to old directory
  for (const file of files) {
    if (file === "old") continue;
    if (file.startsWith("screenshot-")) {
      const oldPath = path.join(outputDir, file);
      const newPath = path.join(oldDir, file);
      await fs.promises.rename(oldPath, newPath);
    }
  }
}

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

  // Set localStorage to simulate cookie consent before loading the page
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem(
      "cookie-consent-preferences",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
      })
    );
    localStorage.setItem("cookie-banner-shown", "true");
  });

  await page.goto(url, { waitUntil: "networkidle2" });

  // Additional safety: hide any cookie banners that might still appear
  await page.addStyleTag({
    content: `
      /* Hide cookie consent banners */
      [class*="cookie"], [id*="cookie"], 
      [class*="consent"], [id*="consent"],
      .fixed.bottom-4.left-4.right-4.z-50,
      .fixed.bottom-4.z-50 {
        display: none !important;
      }
    `,
  });

  for (const theme of themes) {
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: theme },
    ]);

    // Wait a bit for any animations to settle
    await new Promise((resolve) => setTimeout(resolve, 500));

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

async function captureAIAssistantThumbnail({
  browser,
  baseUrl,
}: {
  browser: Browser;
  baseUrl: string;
}) {
  const aiUrl = `${baseUrl}/?ai=true`;
  const page = await browser.newPage();

  // Use desktop size for the AI assistant thumbnail
  const { width, height } = SIZE.desktop;
  await page.setViewport({ width, height });

  // Set localStorage to simulate cookie consent before loading the page
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem(
      "cookie-consent-preferences",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
      })
    );
    localStorage.setItem("cookie-banner-shown", "true");
  });

  await page.goto(aiUrl, { waitUntil: "networkidle2" });

  // Additional safety: hide any cookie banners that might still appear
  await page.addStyleTag({
    content: `
      /* Hide cookie consent banners */
      [class*="cookie"], [id*="cookie"], 
      [class*="consent"], [id*="consent"],
      .fixed.bottom-4.left-4.right-4.z-50,
      .fixed.bottom-4.z-50 {
        display: none !important;
      }
    `,
  });

  // Set dark theme for the AI assistant thumbnail
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: "dark" },
  ]);

  // Wait a bit for any animations to settle
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const filePath = path.join(outputDir, "ai-assistant-thumbnail.webp") as
    | `${string}.webp`
    | `${string}.png`
    | `${string}.jpeg`;

  await page.screenshot({
    path: filePath,
    type: "webp",
    quality: 90,
  });

  console.log(`✅ AI Assistant thumbnail saved:`, filePath);

  await page.close();
}

async function main() {
  // Move old screenshots before capturing new ones
  await moveOldScreenshots();

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

    // Capture AI Assistant thumbnail
    await captureAIAssistantThumbnail({
      browser,
      baseUrl: url,
    });

    console.log("✅ All screenshots captured successfully.");
  } catch (error) {
    console.error("⛔️ Error capturing screenshots:", error);
  } finally {
    await browser.close();
  }
}

main();
