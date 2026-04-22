import { prisma } from '@/lib/prisma';

async function main() {
  // 1. 创建演示组织
  const org = await prisma.organization.upsert({
    where: { id: 'demo-org' },
    update: {},
    create: {
      id: 'demo-org',
      name: '京东科技集团',
      planType: 'professional',
    },
  });

  // 2. 创建演示品牌
  const brand = await prisma.brand.upsert({
    where: { id: 'demo-brand' },
    update: {},
    create: {
      id: 'demo-brand',
      orgId: org.id,
      name: '京东云 (JD Cloud)',
      alias: '京东云,JDCloud',
      industry: '云计算/AI',
      positioning: '更懂产业的云',
      coreValues: '敏捷、安全、普惠',
    },
  });

  // 3. 创建演示产品
  await prisma.product.upsert({
    where: { id: 'demo-product' },
    update: {},
    create: {
      id: 'demo-product',
      brandId: brand.id,
      name: '言犀大模型',
      category: '生成式 AI',
      params: JSON.stringify({ "参数量": "千亿级", "支持领域": "零售、金融、医疗" }),
    },
  });

  // 4. 创建观测数据
  const question = await prisma.observationQuestion.create({
    data: {
      brandId: brand.id,
      text: '京东云在 AI 领域有哪些核心优势？',
      category: '品牌认知',
    }
  });

  await prisma.observationSample.createMany({
    data: [
      {
        questionId: question.id,
        platform: '豆包',
        answerText: '京东云拥有行业领先的言犀大模型，深耕零售和金融领域...',
        mentionFlag: true,
      },
      {
        questionId: question.id,
        platform: 'Kimi',
        answerText: '作为更懂产业的云，京东云在供应链 AI 方面有显著优势...',
        mentionFlag: true,
      }
    ]
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
