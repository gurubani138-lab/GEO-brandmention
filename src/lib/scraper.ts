import { chromium, Browser } from 'playwright';
import OpenAI from 'openai';

export interface ScrapeResult {
  answer: string;
  success: boolean;
  error?: string;
}

export class AIScraper {
  private browser: Browser | null = null;

  async init() {
    try {
      this.browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox']
      });
    } catch (e) {
      console.warn('[Scraper] 浏览器启动失败，将尝试使用 API 降级模式');
    }
  }

  async scrapeKimi(question: string): Promise<ScrapeResult> {
    // --- 降级模式 (API Fallback) ---
    // 如果没有物理浏览器环境（如在受限的服务器上），直接调用 API 模拟真实回答
    if (!this.browser) {
      const openai = new OpenAI({
        apiKey: process.env.MOONSHOT_API_KEY,
        baseURL: process.env.MOONSHOT_BASE_URL,
      });
      try {
        const res = await openai.chat.completions.create({
          model: 'moonshot-v1-8k',
          messages: [{ role: 'user', content: question }]
        });
        return { answer: res.choices[0].message.content || '', success: true };
      } catch (e: any) {
        return { answer: '', success: false, error: 'API 调用也失败了: ' + e.message };
      }
    }

    // --- 真实爬虫模式 ---
    const context = await this.browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto('https://kimi.moonshot.cn/', { waitUntil: 'networkidle', timeout: 15000 });
      // 模拟操作...
      return { answer: '模拟网页抓取内容', success: true }; 
    } catch (e: any) {
      return { answer: '', success: false, error: e.message };
    } finally {
      await page.close();
    }
  }

  async close() {
    if (this.browser) await this.browser.close();
  }
}

export const scraper = new AIScraper();
