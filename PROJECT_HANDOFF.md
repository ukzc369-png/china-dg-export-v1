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