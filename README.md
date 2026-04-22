# BrandMention GEO 智能体运营平台 (Commercial Pro)

> **BrandMention** 是一款面向中国大陆企业市场的 **品牌 AI 可见性运营平台**。通过资产治理、内容生产、真实观测与优化闭环，帮助品牌在生成式 AI 生态中提升识别率、准确性与权威信源引用率。

## 🚀 核心商用模块

### 1. 资产管理 (Asset Management)
- **多维度治理**: 结构化管理品牌资料、产品规格、术语库、禁用语库。
- **证据链挂接**: FAQ 支持与官方资质、白皮书、URL 强关联，确保 AI 回答有据可依。

### 2. 内容生产中心 (Content Engine)
- **AI 智能改写**: 深度集成 Kimi (Moonshot AI) 引擎，针对 GEO 逻辑执行结构化改写。
- **多渠道适配**: 一键生成针对 **小红书、知乎、微信公众号、百家号** 等平台的特定风格文案。
- **合规引擎**: 内置广告法违禁词自动扫描，生成合规审计报告。

### 3. 问答观测中心 (Observation Hub)
- **真实浏览器采集**: 驱动 Playwright 无头浏览器集群，抓取 AI 搜索引擎真实的 DOM 响应。
- **事实一致性校验**: AI 自动对采集样本进行二次核对，判断事实准确度并打分 (0-100)。
- **物理快照**: 自动保存采样瞬间的网页快照，作为可见性凭证。

### 4. 运营看板与诊断 (Dashboard & Optimization)
- **KPI 矩阵**: 实时量化提及率、首提率、事实一致率、异常回复率。
- **自动归因工单**: 针对“未提及”或“事实错误”的问题，AI 自动生成深度诊断报告并下发优化工单。

---

## 🛠 技术架构

- **前端/后端**: Next.js 14 (App Router)
- **样式**: Tailwind CSS (Claude-inspired UI)
- **数据库**: Prisma + SQLite (支持迁移至 PostgreSQL)
- **自动化**: Playwright (Headless Browser)
- **AI 驱动**: Moonshot AI (Kimi) OpenAI-compatible API
- **认证**: NextAuth.js (Enterprise Secure Login)

---

## 📦 快速部署指南

### 1. 环境准备
确保您的服务器已安装 Node.js 18+ 及 Git。

### 2. 获取源码
```bash
git clone https://github.com/gurubani138-lab/GEO-brandmention
cd GEO-brandmention
```

### 3. 安装依赖
```bash
npm install
npx playwright install --with-deps chromium
```

### 4. 配置环境变量
在根目录创建 `.env` 文件：
```env
MOONSHOT_API_KEY=您的Kimi密钥
MOONSHOT_BASE_URL=https://api.moonshot.cn/v1
NEXTAUTH_SECRET=自定义随机字符串
NEXTAUTH_URL=http://localhost:3000
```

### 5. 初始化数据库
```bash
npx prisma db push
npm run seed
```

### 6. 启动生产服务
```bash
npm run build
npm start
```

---

## 🔐 演示账号
- **用户名**: `admin`
- **密码**: `geo123456`

## 📄 许可证
本项目采用商用授权，版权归 BrandMention 团队所有。
