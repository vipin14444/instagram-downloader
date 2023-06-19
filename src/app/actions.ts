"use server";
import puppeteer, { Browser, Page } from "puppeteer";

export async function getReelSource(url: string) {
  try {
    let res = await scrapeInstagramReel(url);
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
}

class BrowserPool {
  private poolSize: number;
  private pool: Browser[];
  private isInitialized: boolean;

  constructor(poolSize = 1) {
    this.poolSize = poolSize;
    this.pool = [];
    this.isInitialized = false;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    for (let i = 0; i < this.poolSize; i++) {
      const browser = await puppeteer.launch({ headless: "new" });
      this.pool.push(browser);
    }

    this.isInitialized = true;
  }

  async getInstance(): Promise<Browser> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.pool.length === 0) {
      throw new Error("Browser pool is empty");
    }

    return this.pool.pop()!;
  }

  releaseInstance(browser: Browser): void {
    this.pool.push(browser);
  }

  async close(): Promise<void> {
    await Promise.all(this.pool.map((browser) => browser.close()));
    this.pool = [];
    this.isInitialized = false;
  }
}

const browserPool = new BrowserPool(2);

async function scrapeInstagramReel(url: string): Promise<string> {
  const browser = await browserPool.getInstance();
  const page = await browser.newPage();

  // Navigate to the Instagram reel page
  await page.goto(url);

  // Wait for the reel video element to load
  await page.waitForSelector("video");

  // Extract the video source URL
  const videoSrc = await page.$eval("video", (element: any) => element.src);

  // Close the page
  await page.close();

  // Release the browser instance back to the pool
  browserPool.releaseInstance(browser);

  return videoSrc;
}
