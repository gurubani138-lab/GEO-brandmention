import { chromium } from 'playwright';

export async function captureAISnapshot(url: string, selector: string = 'body') {
  // 注意：在物理机器上运行前请确保执行了 npx playwright install chromium
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();
    
    // 设置超时，防止挂死
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // 等待核心元素渲染
    await page.waitForTimeout(2000);
    
    const buffer = await page.screenshot({ fullPage: true });
    
    // 在真实商用版中，这里会调用之前写的 uploadSnapshotToOSS(buffer)
    // 这里我们返回一个 Base64 模拟或者你可以对接 OSS
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error('Playwright Screenshot Error:', error);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}
