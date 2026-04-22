# GEO 智能体字段级数据字典 + 核心表结构草案

## 1. 文档目的

本文档用于衔接以下两份文档：

- `D:\GEO\GEO智能体_产品蓝图_立项研发版.md`
- `D:\GEO\GEO智能体_MVP功能清单_页面IA_技术架构草案.md`

目标是把当前产品蓝图继续下钻为可直接用于以下场景的对齐稿：

- 产品定义字段口径
- 后端设计核心表结构
- 前端明确表单和详情页字段
- 测试准备字段校验、状态流转和接口回归

本文档默认以 MVP 范围为主，只覆盖 P0 与必要的 P1 预留字段。

## 2. 建模原则

- 所有核心实体必须有稳定主键、租户归属、创建信息、更新时间和状态字段。
- 所有需要追溯的实体必须支持版本记录或审计记录。
- 所有用于观测与分析的实体必须具备可回溯的来源字段。
- 首期尽量避免过度范式化，先保证业务闭环和字段可扩展。
- 可变结构优先使用 `json/jsonb` 承载，但必须保留可检索的核心字段。

## 3. 通用字段约定

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | `bigint` 或 `uuid` | 主键 |
| `org_id` | `bigint` | 租户 ID |
| `brand_id` | `bigint` | 品牌 ID，品牌级实体必须带 |
| `status` | `varchar(32)` | 业务状态 |
| `created_by` | `bigint` | 创建人 |
| `updated_by` | `bigint` | 更新人 |
| `created_at` | `datetime` | 创建时间 |
| `updated_at` | `datetime` | 更新时间 |
| `deleted_at` | `datetime nullable` | 软删除时间 |
| `remark` | `text nullable` | 备注 |

状态字段建议统一采用小写枚举值，避免多表出现风格不一致问题。

## 4. 核心实体数据字典

### 4.1 `organizations`

组织是最顶层租户主体。

| 字段 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint` | 是 | `10001` | 主键 |
| `org_code` | `varchar(64)` | 是 | `bm_demo_001` | 组织唯一编码 |
| `org_name` | `varchar(128)` | 是 | `某某科技有限公司` | 组织名称 |
| `plan_type` | `varchar(32)` | 是 | `professional` | 套餐类型 |
| `industry` | `varchar(64)` | 否 | `saas` | 所属行业 |
| `owner_user_id` | `bigint` | 否 | `20001` | 主负责人 |
| `status` | `varchar(32)` | 是 | `active` | `pending/active/disabled` |
| `trial_start_at` | `datetime` | 否 | - | 试用开始时间 |
| `trial_end_at` | `datetime` | 否 | - | 试用结束时间 |
| `config_json` | `json` | 否 | `{}` | 组织级扩展配置 |
| `created_by` | `bigint` | 是 | `1` | 创建人 |
| `updated_by` | `bigint` | 是 | `1` | 更新人 |
| `created_at` | `datetime` | 是 | - | 创建时间 |
| `updated_at` | `datetime` | 是 | - | 更新时间 |

索引建议：
- 唯一索引：`uk_org_code(org_code)`
- 普通索引：`idx_org_status(status)`

### 4.2 `users`

| 字段 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint` | 是 | `20001` | 主键 |
| `org_id` | `bigint` | 是 | `10001` | 所属组织 |
| `username` | `varchar(64)` | 是 | `zhangsan` | 登录名 |
| `display_name` | `varchar(64)` | 是 | `张三` | 展示名称 |
| `email` | `varchar(128)` | 否 | `a@b.com` | 邮箱 |
| `mobile` | `varchar(32)` | 否 | `138xxxx` | 手机号 |
| `password_hash` | `varchar(255)` | 是 | - | 密码摘要 |
| `status` | `varchar(32)` | 是 | `active` | `pending/active/disabled/locked` |
| `last_login_at` | `datetime` | 否 | - | 最近登录时间 |
| `created_by` | `bigint` | 是 | `1` | 创建人 |
| `updated_by` | `bigint` | 是 | `1` | 更新人 |
| `created_at` | `datetime` | 是 | - | 创建时间 |
| `updated_at` | `datetime` | 是 | - | 更新时间 |

索引建议：
- 唯一索引：`uk_org_username(org_id, username)`
- 普通索引：`idx_user_status(org_id, status)`

### 4.3 `roles`

| 字段 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint` | 是 | `30001` | 主键 |
| `org_id` | `bigint` | 是 | `10001` | 租户级角色 |
| `role_code` | `varchar(64)` | 是 | `brand_admin` | 角色编码 |
| `role_name` | `varchar(64)` | 是 | `品牌管理员` | 角色名称 |
| `permission_json` | `json` | 是 | `[]` | 菜单和数据权限 |
| `status` | `varchar(32)` | 是 | `active` | 状态 |
| `created_at` | `datetime` | 是 | - | 创建时间 |
| `updated_at` | `datetime` | 是 | - | 更新时间 |

### 4.4 `user_roles`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `user_id` | `bigint` | 是 | 用户 ID |
| `role_id` | `bigint` | 是 | 角色 ID |
| `brand_scope_json` | `json` | 否 | 品牌级访问范围 |
| `created_at` | `datetime` | 是 | 创建时间 |

唯一索引建议：
- `uk_user_role(org_id, user_id, role_id)`

### 4.5 `brands`

品牌是所有品牌级资产的核心锚点。

| 字段 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint` | 是 | `40001` | 主键 |
| `org_id` | `bigint` | 是 | `10001` | 所属组织 |
| `brand_code` | `varchar(64)` | 是 | `brand_demo` | 品牌编码 |
| `brand_name` | `varchar(128)` | 是 | `BrandMention` | 品牌全称 |
| `brand_alias` | `varchar(255)` | 否 | `BM,Brand Mention` | 别名，首期可逗号分隔 |
| `english_name` | `varchar(128)` | 否 | `BrandMention` | 英文名 |
| `industry` | `varchar(64)` | 是 | `saas` | 行业 |
| `positioning` | `varchar(255)` | 否 | - | 品牌定位 |
| `core_values` | `text` | 否 | - | 核心价值 |
| `hq_location` | `varchar(128)` | 否 | `上海` | 总部所在地 |
| `main_business` | `text` | 否 | - | 主营业务 |
| `target_audience` | `text` | 否 | - | 目标客群 |
| `typical_scenarios` | `json` | 否 | `[]` | 典型场景列表 |
| `brand_tags` | `json` | 否 | `[]` | 标签 |
| `forbidden_phrases` | `json` | 否 | `[]` | 品牌禁用表述 |
| `completeness_score` | `decimal(5,2)` | 否 | `82.50` | 完整性分数 |
| `status` | `varchar(32)` | 是 | `active` | `draft/active/archived` |
| `current_version_no` | `int` | 是 | `3` | 当前版本号 |
| `created_by` | `bigint` | 是 | - | 创建人 |
| `updated_by` | `bigint` | 是 | - | 更新人 |
| `created_at` | `datetime` | 是 | - | 创建时间 |
| `updated_at` | `datetime` | 是 | - | 更新时间 |

索引建议：
- 唯一索引：`uk_org_brand_code(org_id, brand_code)`
- 普通索引：`idx_brand_status(org_id, status)`
- 搜索索引：`idx_brand_name(org_id, brand_name)`

### 4.6 `products`

| 字段 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint` | 是 | `50001` | 主键 |
| `org_id` | `bigint` | 是 | `10001` | 所属组织 |
| `brand_id` | `bigint` | 是 | `40001` | 所属品牌 |
| `product_code` | `varchar(64)` | 是 | `geo_agent_pro` | 产品编码 |
| `product_name` | `varchar(128)` | 是 | `GEO Agent Pro` | 产品名称 |
| `category` | `varchar(64)` | 是 | `saas` | 产品分类 |
| `sub_category` | `varchar(64)` | 否 | `marketing_tool` | 子分类 |
| `model_no` | `varchar(64)` | 否 | - | 型号/版本 |
| `params_json` | `json` | 否 | `{}` | 参数模板数据 |
| `capability_boundary` | `text` | 否 | - | 能力边界 |
| `applicable_industries` | `json` | 否 | `[]` | 适用行业 |
| `typical_scenarios` | `json` | 否 | `[]` | 典型使用场景 |
| `delivery_mode` | `varchar(64)` | 否 | `saas` | 交付方式 |
| `pricing_mode` | `varchar(64)` | 否 | `subscription` | 定价方式 |
| `competitor_refs` | `json` | 否 | `[]` | 竞品参考 |
| `common_misunderstandings` | `json` | 否 | `[]` | 常见误解 |
| `forbidden_phrases` | `json` | 否 | `[]` | 产品级禁用语 |
| `status` | `varchar(32)` | 是 | `active` | 状态 |
| `created_by` | `bigint` | 是 | - | 创建人 |
| `updated_by` | `bigint` | 是 | - | 更新人 |
| `created_at` | `datetime` | 是 | - | 创建时间 |
| `updated_at` | `datetime` | 是 | - | 更新时间 |

索引建议：
- 唯一索引：`uk_brand_product_code(brand_id, product_code)`
- 普通索引：`idx_product_category(brand_id, category, status)`

### 4.7 `faqs`

| 字段 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint` | 是 | `60001` | 主键 |
| `org_id` | `bigint` | 是 | `10001` | 所属组织 |
| `brand_id` | `bigint` | 是 | `40001` | 所属品牌 |
| `product_id` | `bigint` | 否 | `50001` | 关联产品 |
| `question` | `varchar(500)` | 是 | - | FAQ 问题 |
| `answer` | `text` | 是 | - | 标准回答 |
| `answer_summary` | `varchar(500)` | 否 | - | 摘要 |
| `evidence_ids_json` | `json` | 否 | `[70001,70002]` | 关联证据 ID 列表 |
| `applicable_region` | `varchar(64)` | 否 | `CN` | 适用地区 |
| `applicable_version` | `varchar(64)` | 否 | `v1` | 适用版本 |
| `risk_level` | `varchar(32)` | 是 | `medium` | `low/medium/high` |
| `public_level` | `varchar(32)` | 是 | `public` | `public/internal/restricted` |
| `source_type` | `varchar(32)` | 否 | `manual_import` | 来源类型 |
| `status` | `varchar(32)` | 是 | `active` | 状态 |
| `created_by` | `bigint` | 是 | - | 创建人 |
| `updated_by` | `bigint` | 是 | - | 更新人 |
| `created_at` | `datetime` | 是 | - | 创建时间 |
| `updated_at` | `datetime` | 是 | - | 更新时间 |

索引建议：
- 普通索引：`idx_faq_brand_product(brand_id, product_id, status)`
- 搜索索引：`idx_faq_question(brand_id, question)`

### 4.8 `terms`

统一术语、别名、禁用语建议单独建表，不直接散落在品牌表和产品表里。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `brand_id` | `bigint` | 是 | 所属品牌 |
| `product_id` | `bigint` | 否 | 关联产品 |
| `term_type` | `varchar(32)` | 是 | `preferred/alias/forbidden` |
| `term_value` | `varchar(255)` | 是 | 术语内容 |
| `normalized_value` | `varchar(255)` | 否 | 规范化值，便于匹配 |
| `priority` | `int` | 否 | 匹配优先级 |
| `status` | `varchar(32)` | 是 | 状态 |
| `created_at` | `datetime` | 是 | 创建时间 |
| `updated_at` | `datetime` | 是 | 更新时间 |

索引建议：
- `idx_term_brand_type(brand_id, term_type, status)`
- `idx_term_normalized(brand_id, normalized_value)`

### 4.9 `evidences`

| 字段 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `bigint` | 是 | `70001` | 主键 |
| `org_id` | `bigint` | 是 | `10001` | 所属组织 |
| `brand_id` | `bigint` | 是 | `40001` | 所属品牌 |
| `product_id` | `bigint` | 否 | `50001` | 关联产品 |
| `source_type` | `varchar(32)` | 是 | `official_site` | 来源类型 |
| `title` | `varchar(255)` | 是 | - | 证据标题 |
| `url` | `varchar(1024)` | 否 | - | 链接型证据 |
| `file_key` | `varchar(255)` | 否 | - | 文件存储 key |
| `file_name` | `varchar(255)` | 否 | - | 原文件名 |
| `mime_type` | `varchar(128)` | 否 | - | 文件类型 |
| `authority_level` | `varchar(32)` | 是 | `high` | `low/medium/high` |
| `published_at` | `datetime` | 否 | - | 发布时间 |
| `is_public_quotable` | `tinyint(1)` | 是 | `1` | 是否可公开引用 |
| `summary` | `text` | 否 | - | 摘要 |
| `extract_text` | `longtext` | 否 | - | 抽取文本，供后续检索 |
| `last_check_at` | `datetime` | 否 | - | 最近巡检时间 |
| `link_status` | `varchar(32)` | 否 | `valid` | `valid/invalid/unchecked` |
| `status` | `varchar(32)` | 是 | `active` | 状态 |
| `created_by` | `bigint` | 是 | - | 创建人 |
| `updated_by` | `bigint` | 是 | - | 更新人 |
| `created_at` | `datetime` | 是 | - | 创建时间 |
| `updated_at` | `datetime` | 是 | - | 更新时间 |

索引建议：
- `idx_evidence_brand_status(brand_id, status)`
- `idx_evidence_check(link_status, last_check_at)`

### 4.10 `content_tasks`

内容任务用于承载生成、改写和后续导出主流程。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `brand_id` | `bigint` | 是 | 所属品牌 |
| `product_id` | `bigint` | 否 | 所属产品 |
| `task_type` | `varchar(32)` | 是 | `generate/rewrite` |
| `content_type` | `varchar(64)` | 是 | `brand_intro/faq/product_intro/...` |
| `channel_type` | `varchar(64)` | 是 | `official_site/help_center/wechat/...` |
| `template_code` | `varchar(64)` | 否 | 模板编码 |
| `input_source_type` | `varchar(32)` | 是 | `asset/manual_text/imported_file` |
| `input_payload_json` | `json` | 否 | 用户输入参数 |
| `status` | `varchar(32)` | 是 | `pending/running/succeeded/failed/cancelled` |
| `model_provider` | `varchar(64)` | 否 | 模型供应商 |
| `model_name` | `varchar(64)` | 否 | 模型名 |
| `model_version` | `varchar(64)` | 否 | 模型版本 |
| `error_code` | `varchar(64)` | 否 | 失败编码 |
| `error_message` | `varchar(500)` | 否 | 失败原因 |
| `started_at` | `datetime` | 否 | 开始时间 |
| `finished_at` | `datetime` | 否 | 结束时间 |
| `created_by` | `bigint` | 是 | 创建人 |
| `updated_by` | `bigint` | 是 | 更新人 |
| `created_at` | `datetime` | 是 | 创建时间 |
| `updated_at` | `datetime` | 是 | 更新时间 |

索引建议：
- `idx_content_task_brand_status(brand_id, status, created_at)`
- `idx_content_task_type(task_type, content_type, channel_type)`

### 4.11 `content_versions`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `task_id` | `bigint` | 是 | 内容任务 ID |
| `brand_id` | `bigint` | 是 | 所属品牌 |
| `version_no` | `int` | 是 | 版本号，从 1 开始 |
| `version_type` | `varchar(32)` | 是 | `draft/rewritten/reviewed/final` |
| `source_text` | `longtext` | 否 | 原始内容 |
| `output_text` | `longtext` | 是 | 输出内容 |
| `diff_summary` | `text` | 否 | 差异摘要 |
| `token_usage_json` | `json` | 否 | token 消耗 |
| `review_status` | `varchar(32)` | 是 | `pending/passed/rejected/manual_confirm` |
| `export_status` | `varchar(32)` | 是 | `not_exported/exported` |
| `created_by` | `bigint` | 是 | 创建人 |
| `created_at` | `datetime` | 是 | 创建时间 |

唯一索引建议：
- `uk_task_version(task_id, version_no)`

### 4.12 `review_records`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `content_version_id` | `bigint` | 是 | 内容版本 ID |
| `review_type` | `varchar(32)` | 是 | `rule/manual` |
| `review_result` | `varchar(32)` | 是 | `passed/rejected/manual_confirm` |
| `risk_level` | `varchar(32)` | 是 | `low/medium/high` |
| `hit_rules_json` | `json` | 否 | 命中规则列表 |
| `comment` | `text` | 否 | 审核意见 |
| `reviewer_id` | `bigint` | 否 | 人工审核人；规则审核可为空 |
| `reviewed_at` | `datetime` | 是 | 审核时间 |
| `created_at` | `datetime` | 是 | 创建时间 |

索引建议：
- `idx_review_content(content_version_id, review_type, reviewed_at)`

### 4.13 `observation_questions`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `brand_id` | `bigint` | 是 | 所属品牌 |
| `product_id` | `bigint` | 否 | 关联产品 |
| `question_text` | `varchar(1000)` | 是 | 问题内容 |
| `category` | `varchar(64)` | 是 | `brand_awareness/product_intro/...` |
| `tags_json` | `json` | 否 | 问题标签 |
| `priority` | `varchar(32)` | 是 | `high/medium/low` |
| `monitor_frequency` | `varchar(32)` | 否 | `weekly/monthly/manual` |
| `status` | `varchar(32)` | 是 | `active/disabled` |
| `remark` | `text` | 否 | 备注 |
| `created_by` | `bigint` | 是 | 创建人 |
| `updated_by` | `bigint` | 是 | 更新人 |
| `created_at` | `datetime` | 是 | 创建时间 |
| `updated_at` | `datetime` | 是 | 更新时间 |

索引建议：
- `idx_question_brand_category(brand_id, category, priority, status)`

### 4.14 `observation_tasks`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `brand_id` | `bigint` | 是 | 所属品牌 |
| `task_name` | `varchar(128)` | 是 | 任务名称 |
| `platform_name` | `varchar(64)` | 是 | 平台名 |
| `schedule_type` | `varchar(32)` | 是 | `manual/weekly/monthly` |
| `question_set_json` | `json` | 否 | 本次执行的问题 ID 列表快照 |
| `sampling_rule_json` | `json` | 否 | 采样规则 |
| `status` | `varchar(32)` | 是 | `pending/running/succeeded/failed/partial_failed` |
| `run_mode` | `varchar(32)` | 是 | `baseline/retest/routine` |
| `started_at` | `datetime` | 否 | 开始时间 |
| `finished_at` | `datetime` | 否 | 结束时间 |
| `error_summary` | `varchar(500)` | 否 | 错误摘要 |
| `created_by` | `bigint` | 是 | 创建人 |
| `created_at` | `datetime` | 是 | 创建时间 |
| `updated_at` | `datetime` | 是 | 更新时间 |

索引建议：
- `idx_ob_task_brand_platform(brand_id, platform_name, status, created_at)`

### 4.15 `observation_samples`

样本是观测中心最关键的数据资产。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `task_id` | `bigint` | 是 | 观测任务 ID |
| `question_id` | `bigint` | 是 | 题目 ID |
| `brand_id` | `bigint` | 是 | 所属品牌 |
| `platform_name` | `varchar(64)` | 是 | 平台名 |
| `question_text_snapshot` | `varchar(1000)` | 是 | 题目快照 |
| `answer_text` | `longtext` | 否 | 回答正文 |
| `answer_summary` | `text` | 否 | 回答摘要 |
| `snapshot_text_key` | `varchar(255)` | 否 | 文本快照对象存储地址 |
| `snapshot_image_key` | `varchar(255)` | 否 | 图片快照地址 |
| `executed_at` | `datetime` | 是 | 采样时间 |
| `response_status` | `varchar(32)` | 是 | `success/timeout/blocked/failed` |
| `http_meta_json` | `json` | 否 | 平台响应元信息 |
| `status` | `varchar(32)` | 是 | `active/invalid` |
| `created_at` | `datetime` | 是 | 创建时间 |

索引建议：
- `idx_sample_task(task_id, executed_at)`
- `idx_sample_brand_platform(brand_id, platform_name, executed_at)`
- `idx_sample_question(question_id, executed_at)`

### 4.16 `sample_labels`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `sample_id` | `bigint` | 是 | 样本 ID |
| `label_source` | `varchar(32)` | 是 | `auto/manual` |
| `mention_flag` | `tinyint(1)` | 是 | 是否提及品牌 |
| `first_mention_flag` | `tinyint(1)` | 否 | 是否首提 |
| `fact_consistency_score` | `decimal(5,2)` | 否 | 事实一致性评分 |
| `explicit_reference_flag` | `tinyint(1)` | 否 | 是否显式引用官方证据 |
| `error_flag` | `tinyint(1)` | 否 | 是否存在关键错误 |
| `competitor_mention_flag` | `tinyint(1)` | 否 | 是否出现竞品 |
| `sentiment` | `varchar(32)` | 否 | `positive/neutral/negative` |
| `next_action_flag` | `tinyint(1)` | 否 | 是否建议进一步行动 |
| `reason_json` | `json` | 否 | 标注说明 |
| `confidence_score` | `decimal(5,2)` | 否 | 自动标注置信度 |
| `labeled_by` | `bigint` | 否 | 人工标注人 |
| `labeled_at` | `datetime` | 是 | 标注时间 |
| `created_at` | `datetime` | 是 | 创建时间 |

索引建议：
- `idx_label_sample(sample_id, label_source)`

### 4.17 `metric_snapshots`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `brand_id` | `bigint` | 是 | 所属品牌 |
| `product_id` | `bigint` | 否 | 关联产品 |
| `platform_name` | `varchar(64)` | 是 | 平台名 |
| `period_type` | `varchar(32)` | 是 | `daily/weekly/monthly/custom` |
| `period_start` | `datetime` | 是 | 周期起始 |
| `period_end` | `datetime` | 是 | 周期结束 |
| `sample_count` | `int` | 是 | 样本量 |
| `mention_rate` | `decimal(5,2)` | 否 | 品牌提及率 |
| `first_mention_rate` | `decimal(5,2)` | 否 | 首提率 |
| `fact_consistency_rate` | `decimal(5,2)` | 否 | 事实一致率 |
| `explicit_reference_rate` | `decimal(5,2)` | 否 | 显式引用率 |
| `error_rate` | `decimal(5,2)` | 否 | 错误率 |
| `competitor_mention_rate` | `decimal(5,2)` | 否 | 竞品出现率 |
| `summary_json` | `json` | 否 | 附加统计 |
| `generated_at` | `datetime` | 是 | 生成时间 |

索引建议：
- `idx_metric_brand_platform_period(brand_id, platform_name, period_type, period_start, period_end)`

### 4.18 `optimization_tickets`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 是 | 所属组织 |
| `brand_id` | `bigint` | 是 | 所属品牌 |
| `source_sample_id` | `bigint` | 是 | 来源样本 |
| `source_question_id` | `bigint` | 否 | 来源问题 |
| `ticket_no` | `varchar(64)` | 是 | 工单编号 |
| `title` | `varchar(255)` | 是 | 工单标题 |
| `diagnosis_type` | `varchar(64)` | 是 | `faq_missing/evidence_weak/...` |
| `diagnosis_reason` | `text` | 否 | 归因说明 |
| `suggestion_text` | `text` | 是 | 优化建议 |
| `priority` | `varchar(32)` | 是 | `high/medium/low` |
| `confidence_score` | `decimal(5,2)` | 否 | 建议置信度 |
| `owner_user_id` | `bigint` | 否 | 负责人 |
| `due_at` | `datetime` | 否 | 预计完成时间 |
| `status` | `varchar(32)` | 是 | `open/in_progress/resolved/closed/cancelled` |
| `resolution_note` | `text` | 否 | 完成说明 |
| `resolved_at` | `datetime` | 否 | 完成时间 |
| `retest_task_id` | `bigint` | 否 | 复测任务 |
| `created_by` | `bigint` | 是 | 创建人 |
| `updated_by` | `bigint` | 是 | 更新人 |
| `created_at` | `datetime` | 是 | 创建时间 |
| `updated_at` | `datetime` | 是 | 更新时间 |

索引建议：
- 唯一索引：`uk_ticket_no(ticket_no)`
- 普通索引：`idx_ticket_brand_status(brand_id, status, priority)`
- 普通索引：`idx_ticket_owner(owner_user_id, status, due_at)`

### 4.19 `audit_logs`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `bigint` | 是 | 主键 |
| `org_id` | `bigint` | 否 | 租户，可空表示平台级 |
| `user_id` | `bigint` | 否 | 操作人 |
| `action_type` | `varchar(64)` | 是 | `login/export/delete/update_config` |
| `resource_type` | `varchar(64)` | 否 | 资源类型 |
| `resource_id` | `varchar(64)` | 否 | 资源 ID |
| `request_id` | `varchar(64)` | 否 | 请求追踪 ID |
| `before_json` | `json` | 否 | 变更前 |
| `after_json` | `json` | 否 | 变更后 |
| `ip` | `varchar(64)` | 否 | IP |
| `user_agent` | `varchar(255)` | 否 | UA |
| `created_at` | `datetime` | 是 | 操作时间 |

索引建议：
- `idx_audit_org_time(org_id, created_at)`
- `idx_audit_user_action(user_id, action_type, created_at)`

## 5. 版本与历史表建议

MVP 不建议给所有实体都单独做历史表，但建议以下对象保留版本或快照能力：

- `brands`：品牌资料版本
- `products`：产品资料版本
- `faqs`：FAQ 变更历史
- `content_versions`：内容版本主链
- `review_records`：审核历史
- `observation_samples`：样本快照不可覆盖
- `optimization_tickets`：工单状态流转记录

可选扩展表：

- `brand_versions`
- `product_versions`
- `faq_versions`
- `ticket_histories`

## 6. 状态机建议

### 6.1 内容任务状态

`pending -> running -> succeeded`

异常路径：

- `pending -> cancelled`
- `running -> failed`
- `failed -> running`（重试）

### 6.2 内容审核状态

`pending -> passed`

异常路径：

- `pending -> rejected`
- `pending -> manual_confirm`
- `rejected -> pending`（重新提交）

### 6.3 观测任务状态

`pending -> running -> succeeded`

异常路径：

- `running -> partial_failed`
- `running -> failed`

### 6.4 工单状态

`open -> in_progress -> resolved -> closed`

异常路径：

- `open -> cancelled`
- `in_progress -> cancelled`
- `resolved -> in_progress`（复开）

## 7. 接口边界与字段流转说明

### 7.1 前端表单提交口径

前端提交时应遵循以下原则：

- 不提交审计字段，如 `created_at`、`updated_at`
- 枚举字段统一传编码值，不传中文文案
- 文件上传与业务保存分两步，先拿 `file_key` 再提交业务实体
- 富文本或长文本尽量与结构化字段分离，避免一次提交过大

### 7.2 BFF 层职责

BFF 或 API 网关建议承担以下逻辑：

- 品牌上下文校验
- 角色权限和菜单权限校验
- 前端字段转后端字段的轻量映射
- 聚合多个领域服务的展示型数据

不建议让 BFF 承担：

- 指标计算
- 归因判断
- 模型提示词拼装
- 数据库事务型编排

### 7.3 字段流转示例

#### 内容生成

前端输入：
- `brand_id`
- `product_id`
- `content_type`
- `channel_type`
- `template_code`
- `input_payload_json`

服务落库：
- `content_tasks`

模型返回后落库：
- `content_versions`

审核后落库：
- `review_records`

#### 观测任务

前端或定时任务输入：
- `brand_id`
- `platform_name`
- `schedule_type`
- `question_set_json`

服务落库：
- `observation_tasks`

采样完成后落库：
- `observation_samples`

自动标注后落库：
- `sample_labels`

聚合后落库：
- `metric_snapshots`

#### 优化闭环

异常样本输入：
- `source_sample_id`
- `diagnosis_type`
- `suggestion_text`
- `priority`

服务落库：
- `optimization_tickets`

复测回填：
- `retest_task_id`
- `resolution_note`
- `resolved_at`

## 8. 首批接口清单建议

### 8.1 组织与权限

- `POST /api/orgs`
- `GET /api/orgs/:id`
- `POST /api/users`
- `PATCH /api/users/:id/status`
- `GET /api/roles`
- `POST /api/user-roles`

### 8.2 资产中心

- `GET /api/brands`
- `POST /api/brands`
- `GET /api/brands/:id`
- `PATCH /api/brands/:id`
- `GET /api/products`
- `POST /api/products`
- `GET /api/faqs`
- `POST /api/faqs`
- `GET /api/evidences`
- `POST /api/evidences`
- `POST /api/import/assets`

### 8.3 内容中心

- `POST /api/content-tasks/generate`
- `POST /api/content-tasks/rewrite`
- `GET /api/content-tasks`
- `GET /api/content-tasks/:id`
- `GET /api/content-versions/:id`
- `POST /api/content-versions/:id/export`

### 8.4 审核中心

- `POST /api/reviews/rule-check`
- `POST /api/reviews/manual`
- `GET /api/reviews`
- `GET /api/reviews/:id`

### 8.5 观测中心

- `GET /api/questions`
- `POST /api/questions`
- `POST /api/observation-tasks`
- `GET /api/observation-tasks`
- `GET /api/observation-samples`
- `GET /api/observation-samples/:id`
- `POST /api/sample-labels/manual`

### 8.6 看板与优化中心

- `GET /api/dashboard/summary`
- `GET /api/dashboard/trends`
- `GET /api/dashboard/issues`
- `POST /api/optimization-tickets`
- `GET /api/optimization-tickets`
- `PATCH /api/optimization-tickets/:id`
- `POST /api/optimization-tickets/:id/retest`

## 9. 建议优先落表顺序

建议后端按以下顺序先建表，保证最短时间打通闭环：

1. `organizations`
2. `users`
3. `roles`
4. `user_roles`
5. `brands`
6. `products`
7. `terms`
8. `evidences`
9. `faqs`
10. `content_tasks`
11. `content_versions`
12. `review_records`
13. `observation_questions`
14. `observation_tasks`
15. `observation_samples`
16. `sample_labels`
17. `metric_snapshots`
18. `optimization_tickets`
19. `audit_logs`

## 10. 当前版本需要产品确认的字段问题

这些问题不阻塞文档输出，但在正式建模前建议尽快冻结：

- `brand_alias` 是单字符串、多值列表还是独立别名表
- `params_json` 是否需要按行业拆成更强约束的字段模板
- `evidence_ids_json` 是否在 MVP 就拆成中间关联表
- `fact_consistency_score` 是布尔、枚举还是 0-100 分数
- `ticket_no` 编码规则是否需要带组织或品牌前缀
- `question_set_json` 是否保留任务快照，还是仅关联题库 ID

## 11. 最终建议

如果下一步继续推进，最有价值的工作已经不是继续扩写文档，而是把本文档直接转成两类研发产物：

1. 数据库 DDL 草案
2. OpenAPI/接口定义稿

这样产品、后端、前端和测试就可以从“讨论方案”进入“并行开工”阶段。
