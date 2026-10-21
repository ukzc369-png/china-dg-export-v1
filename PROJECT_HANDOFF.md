# ChinaDGExport 项目交接文档

## 一、项目基本信息

项目名称：ChinaDGExport

项目定位：中国危险化学品出口执行平台

线上地址：
https://china-dg-export-v1.pages.dev

GitHub 仓库：
https://github.com/ukzc369-png/china-dg-export-v1

当前技术栈：
- React
- TypeScript
- Vite
- Cloudflare Pages
- Cloudflare Pages Functions
- Resend Email API

---

## 二、当前已完成

### 官网前端

已完成：
- Home 首页
- Products 产品中心
- Services 服务
- Markets 市场
- Cases 案例
- Insights 知识
- Contact 联系页面
- PC端适配
- 移动端适配
- 三条杠菜单
- 中英文切换

### 部署

Cloudflare Pages 已部署成功。

Cloudflare 构建配置：

Build command:

npm run build

Build output:

dist

Production branch:

main

---

## 三、询盘系统

当前询盘系统已完成并上线。

流程：

访客填写 Contact 表单  
↓  
点击 Submit Inquiry  
↓  
前端调用 /api/inquiry  
↓  
Cloudflare Pages Function 处理  
↓  
Resend 发送邮件  
↓  
ukzc369@gmail.com 收到询盘  

已验证：
- 表单可以提交
- 页面显示提交成功
- Gmail 已收到询盘邮件
- Resend 已有发送记录

询盘后端文件：

functions/api/inquiry.ts

接收邮箱：

ukzc369@gmail.com

Cloudflare 环境变量：

RESEND_API_KEY

配置位置：

Cloudflare  
Workers & Pages  
china-dg-export-v1  
Settings  
Variables and Secrets  

注意：
不要把 RESEND_API_KEY 写进代码。
不要把 API Key 发给 GPT 或任何人。

---

## 四、当前重要提交记录

已完成的重要阶段：

- restore best version with mobile menu
- fix mobile platform scope display
- add project handoff document
- inquiry form v1 completed
- connect resend email
- connect inquiry api
- add customer auto reply email

当前生产版本已包含询盘系统。

---

## 五、本地开发命令

安装依赖：

npm install

本地预览：

npm run dev

本地构建：

npm run build

提交代码：

git add .
git commit -m "your commit message"
git push origin main

---

## 六、开发原则

1. 不允许重构现有页面。

2. 不允许替换现有 UI。

3. 不允许重新创建项目。

4. 所有新功能必须在当前代码基础上扩展。

5. 每次修改必须保证：
   - PC端正常
   - 移动端正常
   - Cloudflare 正常部署
   - Contact 表单可提交
   - Gmail 可收到询盘

6. 大功能开发前必须新建分支。

7. 阶段性完成后必须打 Git 标签。

---

## 七、后续开发优先级

### 第一优先级：产品详情页

目标：
每个产品有独立详情页。

内容：
- Product name
- CAS No.
- UN No.
- Purity
- Packing
- Application
- Export support
- Request Quote 按钮

### 第二优先级：SEO

目标：
让 Google 收录并带来询盘。

需要做：
- meta title
- meta description
- sitemap.xml
- robots.txt
- 产品详情页关键词
- 国家市场页关键词

### 第三优先级：Google Analytics

目标：
统计访客来源、国家、页面访问和询盘转化。

### 第四优先级：Google Search Console

目标：
提交网站，让 Google 开始索引。

### 第五优先级：正式域名和企业邮箱

当前使用：
onboarding@resend.dev

未来建议：
sales@chinadgexport.com
inquiry@chinadgexport.com

需要：
- 购买正式域名
- Resend 添加域名
- 配置 DNS
- 验证 DKIM/SPF
- 修改 functions/api/inquiry.ts 的 from 地址

### 第六优先级：询盘数据备份

建议接入：
- Google Sheets
或
- Supabase
或
- Airtable

目标：
每条询盘除了邮件通知外，也保存成客户数据库。

---

## 八、下一次 GPT 继续开发提示词

下一次换 GPT 时，把下面这段发给它：

你正在继续开发 ChinaDGExport 项目。

这是一个 React + TypeScript + Vite 项目，部署在 Cloudflare Pages。

项目已经完成：
- 官网前端
- PC端
- 移动端
- 三条杠菜单
- Contact 表单
- Cloudflare Pages Functions
- Resend 邮件询盘系统
- Gmail 收询盘

线上地址：
https://china-dg-export-v1.pages.dev

GitHub：
https://github.com/ukzc369-png/china-dg-export-v1

请先阅读 PROJECT_HANDOFF.md。

开发要求：
不要重构现有页面。
不要重新创建项目。
不要替换现有 UI。
必须在当前稳定版本基础上继续扩展。

下一步优先开发：
产品详情页系统。

---

## 九、2026-10-21 继续工作记忆（换账号必读）

### 正式网站与仓库

正式网站：
https://chinachemexport.com

Cloudflare Pages 项目：
china-dg-export-v1

GitHub：
https://github.com/ukzc369-png/china-dg-export-v1

当前工作目录：
D:\CodexData\.codex\worktrees\9bb7\ChinaDGExport-V1

### 已完成的近期工作

- CCE Logo 已替换并发布。
- 首页已完成 SEO/GEO 与询盘转化优化。
- 首页新增供应商比较、当前价格、规格/文件/包装/运输可行性等表达。
- 新增文章：
  `chemical-export-service-china-supplier-price-document-guide`
- 文章已生成专属封面：
  `public/blog/chemical-export-service-china-guide-cover.png`
- 已加入 Cloudflare Pages SPA 路由回退：
  `public/_redirects`
- 已修复文章备用数据被 Supabase CMS 数据覆盖的问题。
- 中文切换已改为不刷新整页，并同步更新文章内容和主要页面内容。

### 最近重要提交

- `02c3637` update CCE brand logo
- `5d919e5` improve sourcing SEO and GEO content
- `7cdfaf9` prevent public site crash without Supabase env
- `940579a` complete homepage conversion optimization
- `454d1f4` publish china chemical export service buyer guide
- `aba89ca` add cover image to export service guide
- `dfd03f0` fix direct access for article routes
- `832e819` preserve published guide when CMS loads
- `5df3de4` format export guide with structured sections
- `9570761` make language switch update article content

### 必须遵守的发布流程

用户明确要求：任何网站修改不能只以“代码已提交/已推送”为完成标准。

每次修改必须：

1. 本地 `npm run build` 通过。
2. 提交并推送到 `main`，触发 Cloudflare 部署。
3. 打开正式网站 `https://chinachemexport.com` 检查实际线上页面。
4. 检查目标页面、文案、图片、链接、中文切换、刷新和深层 URL。
5. 如果线上还是旧版本、404、空白页或功能异常，继续排查，不能报告“已完成”。

### 当前已知风险

- Cloudflare Pages 自动部署可能有延迟，必须以正式域名实际打开结果为准。
- Supabase CMS 数据加载可能覆盖本地备用文章，新增文章必须同时保留在主应用数据源。
- 文章深层 URL 需要 `public/_redirects`，否则直接打开可能出现 404。
- 不要把 Cloudflare Token、Supabase 密钥或 Resend API Key 粘贴到对话中。

### 当前建议的下一步

1. 在正式网站验证最新文章英文显示。
2. 点击文章页中文按钮，确认标题、正文、FAQ、侧栏同步切换且不 404。
3. 检查首页线上是否已经显示最新的五项优化文案。
4. 继续根据 Google Search Console 七天数据优化已有曝光页面，不要只增加无搜索意图的文章。

### 换 GPT 账号时使用的继续指令

请读取项目根目录的 `PROJECT_HANDOFF.md`，继续负责 ChinaChemExport 独立站运营和开发。正式网站是 https://chinachemexport.com，仓库是 https://github.com/ukzc369-png/china-dg-export-v1。必须遵守文档中的“每次修改后打开正式网站真实检查”的发布流程；不要只根据 Git 推送或 Cloudflare 后台状态报告完成。先检查当前线上文章路由、中文切换和首页版本，再开展新任务。
