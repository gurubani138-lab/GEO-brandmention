import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: process.env.MOONSHOT_BASE_URL,
});

export async function generateGeoContent({
  brandName,
  industry,
  contentType,
  channel = 'general',
  inputText,
  assets,
}: {
  brandName: string;
  industry: string;
  contentType: string;
  channel?: string;
  inputText: string;
  assets?: string;
}) {
  const channelPrompts: Record<string, string> = {
    wechat: '采用微信公众号风格：语气亲和，多使用短句，适当加入表情符号，增强互动感。',
    zhihu: '采用知乎深度专业风格：逻辑严密，引用数据或资质作为证据，采用“利益点+证据来源”的叙述方式。',
    xiaohongshu: '采用小红书种草风格：标题吸引人，文风活泼感性，多用 Emoji，重点突出“使用体验”和“亲测好用”。',
    baijiahao: '采用百家号新闻风：语气客观、权威，结构清晰，适合全网搜索引擎抓取摘要。',
    official: '采用官网严谨风格：高度标准化，使用多级标题，包含明确的参数对比表。',
    general: '通用 GEO 优化风格：结构化强，机器可读性高。'
  };

  const systemPrompt = `你是一个专业的 GEO (生成式引擎优化) 专家。
你的任务是将内容改写为对 AI 极其友好的结构化 Markdown 内容。

渠道要求：${channelPrompts[channel] || channelPrompts.general}
行业环境：${industry}
品牌约束：${assets}

GEO 核心法则：
1. 使用分级标题 (##, ###) 和列表。
2. 每一个核心观点必须跟进一个“证据来源”。
3. 严格禁止广告法违禁词：如“最”、“第一”、“顶级”等。
4. 将参数转化为标准化 Markdown 表格。`;

  const response = await openai.chat.completions.create({
    model: 'moonshot-v1-8k',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `请将以下内容进行 GEO 优化改写：\n\n${inputText}` },
    ],
  });

  const output = response.choices[0].message.content || '';

  // --- 自动规则审核引擎 ---
  const forbiddenWords = ['最', '第一', '顶级', '全球首创', '唯一'];
  const hitWords = forbiddenWords.filter(word => output.includes(word));
  
  const auditReport = {
    passed: hitWords.length === 0,
    hitRules: hitWords.map(w => `命中广告法禁用词: ${w}`),
    timestamp: new Date().toISOString()
  };

  return { output, auditReport };
}
