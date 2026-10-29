# ChinaChemExport 独立站持续运营记忆

> 本文件是网站运营、SEO/GEO、询盘转化、内容发布和部署验收的长期记忆。每次开始工作先读取；每次发生重要修改、发布或策略变化后更新。不得把网站当作新项目重新判断。

## 1. 项目身份

- 品牌：ChinaChemExport
- 正式网站：https://chinachemexport.com
- 定位：面向海外工业买家的中国化工品独立寻源与出口协调网站
- 差异化：依托山东/东营产业带，协调供应商筛选、规格及批次文件审核、包装、危险品资料、报关、订舱与运输可行性
- 身份边界：不是所有产品的生产商，不发布未经确认的库存、固定报价或虚假授权关系
- 技术：React + TypeScript + Vite + Cloudflare Pages + Supabase + Resend
- Cloudflare Pages 项目：`china-dg-export-v1`
- GitHub：`ukzc369-png/china-dg-export-v1`
- 生产分支：`main`

## 2. 绝对发布验收规则

任何网站工作都不能以“代码写完、Git 推送成功或 Cloudflare 显示成功”作为完成标准。必须依次：

1. 本地构建通过。
2. 运行相关测试。
3. 提交并推送生产分支。
4. 等待 Cloudflare 实际部署。
5. 打开正式域名检查目标页面。
6. 核对 HTTP 状态、页面文案、图片、链接、SEO 元数据、深层 URL 刷新；涉及语言时检查中英文切换。
7. 线上仍是旧版、404、空白或局部失效时继续修复，不得报告完成。

## 3. 长期运营策略

- 第一目标是真实 B2B 询盘，不以文章数量或展示量作为唯一目标。
- SEO 与 GEO 同步：页面要直接回答买家问题，包含清晰实体、产品/CAS、规格、文件、包装、目的地和责任边界。
- 优先优化已有曝光页面，再新增文章；不为更新频率发布低意图内容。
- 产品页承担交易意图，文章承担问题、市场和出口路线意图，两者必须双向内链。
- 同一产品的多篇文章必须区分搜索意图，避免关键词内耗。
- 文案自然、具体、像有实务经验的个人撰写，避免空泛 AI 套话。
- 图片应国际化、化工化、真实可信；不得带错误分类、虚假标志或不安全作业场景。
- 不宣称“最低价”；使用“比较合适供应商、当前商业条件和可执行方案”的可信表达。

## 4. 已完成的重要建设

- CCE/ChinaChemExport 品牌 Logo 已上线。
- 首页完成国际化视觉、供应链流程、产品展示、产业带与询盘转化优化。
- 已建立产品详情页、文章页、联系询盘页、SEO 元数据、sitemap、robots 和预渲染深层路由。
- 已修复文章深层 URL 404、Supabase 缺少环境变量导致空白、CMS 覆盖本地备用文章等问题。
- 中英文按钮采用站内状态切换；历史上曾出现文章切中文 404、只变导航不变正文的问题，今后语言相关修改必须专项回归。
- 询盘通过 `/api/inquiry`、Cloudflare Pages Functions 和 Resend 发送；密钥不得写入代码或对话。
- 已发布并重点运营 DMC、氯仿、DCM、白油及 Chemical Export Service 等买家指南。

## 5. 最近产品页优化

### DMC 产品页

- 地址：`/products/dimethyl-carbonate-dmc`
- 旧图错误写有 `ALCOHOLS & GLYCOLS`，已替换为无文字的蓝色钢桶与 IBC 出口仓储场景。
- 新图：`public/product-images/dimethyl-carbonate-dmc-616-38-6-v2.webp`
- 已补充：产品身份、规格/杂质核验、TDS/SDS/批次 COA、包装选择、目的地审核、买家询盘清单、FAQ。
- 已与两篇 DMC 指南建立双向链接。
- SEO 标题：`Dimethyl Carbonate Supplier China | DMC CAS 616-38-6`
- 相关提交：`1923ec4 improve DMC product page and image`
- 发布后已在线核验产品页、新图片、两篇相关文章、联系页和 sitemap 均为 HTTP 200。

## 6. 2026-10-29 Search Console 数据基线

用户提供的最近 3 个月数据：

- 总点击：1
- 总展示：147
- CTR：0.7%
- 平均排名：31.5

主要页面：

- `/chemical-sourcing`：17 展示、1 点击；当前唯一产生点击的页面。
- 首页 `/`：76 展示、0 点击；曝光最高但点击不足，是首要 CTR 优化对象。
- DMC 越南指南：27 展示、0 点击。
- DMC 中国供应与出口指南：25 展示、0 点击。
- 氯仿越南指南：22 展示、0 点击。
- DCM 印度指南：12 展示、0 点击。
- 东营出口文章：7 展示、0 点击。
- 一站式出口合规文章：5 展示、0 点击。
- 白油德班文章：4 展示、0 点击。

主要查询词包括：

- `chinachemexport.com`：10 展示
- `chemical export service china`：8 展示
- `china chemical export company`：6 展示
- `chemical exporter china`：3 展示
- `how vietnam dmc coordinates suppliers`：2 展示
- `china chem`：2 展示
- `chemical export company china`：2 展示
- `asia sourcing chemical consultancy`：1 展示
- `chloro china`：1 展示
- `chloro vietnam`：1 展示

国家/地区：

- 美国：80 展示、0 点击；最大曝光市场，优先优化英文标题和摘要。
- 印度：10 展示、0 点击。
- 越南：7 展示、0 点击。
- 韩国、巴西、印尼、菲律宾等各有少量展示。
- 南非：3 展示、1 点击。

判断：网站已经进入 Google 测试展示阶段，当前瓶颈不是完全没有收录，而是排名靠后、摘要吸引力不足、交易意图表达仍需加强。

## 7. 当前运营优先级

1. 优化首页 title、description 和首屏，使其明确覆盖 `chemical export service china`、`china chemical export company`、`chemical exporter china`，同时保持可信身份边界。
2. 保留并加强 `/chemical-sourcing`，因为它已产生首个点击；增加到产品、出口支持和询盘页的清晰路径。
3. 区分两篇 DMC 内容意图：一篇面向中国供应商/出口通用搜索，一篇专注越南进口、文件、包装和运输。
4. 优化已有展示的氯仿、DCM、白油文章标题和搜索摘要，不盲目新增相似文章。
5. 针对美国买家强化规格、SDS/COA、包装、目的港、Incoterm 和责任主体等采购信息。
6. 持续检查产品页独立价值、产品图准确性、文章—产品双向内链和结构化数据。

## 8. Git 与文件安全

- 工作区可能存在用户未提交内容，不覆盖、不重置无关修改。
- 禁止 `git reset --hard` 或未经授权丢弃用户内容。
- 当前工作树可能处于 detached HEAD；发布时确认目标为 `origin/main`。
- API Token、Supabase Key、Resend Key 不得提交或在对话中展示。
- Cloudflare 自动部署存在延迟，必须等待并以正式域名为准。

## 9. 每次继续工作的启动步骤

1. 阅读本文件和 `PROJECT_HANDOFF.md`。
2. 查看 Git 状态与最近提交，保护未提交工作。
3. 检查正式网站当前状态，不假设之前部署一定仍正常。
4. 根据最新 GSC/GA 数据选择动作。
5. 完成修改、构建、测试、发布、正式域名验证。
6. 把重要结果、提交号、线上验证和下一步更新回本文件。

## 10. 2026-10-29 CTR 优化发布

根据 3 个月 147 展示、1 点击、CTR 0.7%、平均排名 31.5 的基线，已完成第一轮“优化已有曝光页而非继续堆文章”的 CTR 调整。

### 修改内容

- 首页 SEO 标题改为：`Chemical Export Service China | Sourcing & Shipping`
- 首页摘要直接覆盖供应商、规格、SDS、COA、包装和出运方案。
- `/chemical-sourcing` 标题改为：`Chemical Sourcing Service China | Supplier & Price Review`
- 寻源页摘要强化当前供应、批次 COA、SDS、价格和出口可行性。
- 寻源页新增 DMC、氯仿、DCM 和询盘页的可抓取内部链接。
- DMC 通用指南与越南指南拆分搜索意图：
  - `Dimethyl Carbonate Supplier China | DMC Export Guide`
  - `DMC Supplier China to Vietnam | Packing & Import Guide`
- 优化已有展示的页面标题：
  - `Chloroform China to Vietnam | SDS, COA & Shipping`
  - `Methylene Chloride China to India | MSDS & Packing`
  - `White Oil Supplier China: Flexibag & Durban Import Guide`
- 同步修改浏览器运行时元数据、CMS 加载后的覆盖逻辑及 Google 抓取的预渲染 HTML，避免只改前端显示而搜索引擎仍读取旧标题。

### 发布与验证

- 提交：`f5e165d optimize search titles for higher CTR`
- 本地构建通过。
- 31 项自动测试全部通过。
- 正式网站逐页核验：首页、寻源页、两篇 DMC、氯仿、DCM、白油均为 HTTP 200。
- 七个页面的新 title、description、canonical 均在正式域名 HTML 中确认生效。
- `/chemical-sourcing` 到 DMC、氯仿、DCM 和 `/contact` 的链接均在线存在。

### 后续观察

- 观察窗口：14–21 天，不要短期频繁改动同一批标题。
- 重点比较首页、两篇 DMC、氯仿、DCM 的展示、平均排名和 CTR 变化。
- 如果展示增加但仍无点击，再根据 GSC 的“查询词—页面”数据微调标题；如果平均排名仍在 30 名以后，优先加强页面独立内容和相关内部链接，而不是继续堆相似文章。
