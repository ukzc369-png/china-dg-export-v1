export type LegalPageKey = "privacy" | "terms" | "cookies" | "dangerous-goods";
export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalDocument = { title: string; intro: string; sections: LegalSection[] };

export const legalDocuments: Record<LegalPageKey, { en: LegalDocument; zh: LegalDocument }> = {
  privacy: {
    en: {
      title: "Privacy Policy",
      intro: "Last updated: July 16, 2026. This policy explains how ChinaChemExport handles personal information submitted through this website.",
      sections: [
        { heading: "Information we collect", paragraphs: ["We may collect your name, business email, company, telephone or messaging contact, requested product, quantity, destination, packing requirements, inquiry message, and technical website data such as pages viewed, browser type, approximate location and referral source."] },
        { heading: "How we use information", paragraphs: ["We use information to answer inquiries, prepare quotations, assess product availability and export feasibility, coordinate compliance and logistics, prevent misuse, improve the website, and maintain business records."] },
        { heading: "Legal bases", paragraphs: ["Depending on your location, processing is based on steps requested before entering a contract, performance of a contract, legitimate business interests, legal obligations, or your consent for optional analytics cookies."] },
        { heading: "Service providers and international transfers", paragraphs: ["We use service providers including Supabase for database and file storage, Resend for transactional email, Google Analytics when consented, and our hosting and DNS providers. Data may be processed outside your country, including in China and the United States, subject to applicable safeguards and provider terms."] },
        { heading: "Retention and security", paragraphs: ["Inquiry and business records are retained only as long as reasonably necessary for quotation follow-up, contractual, compliance, dispute and accounting purposes. We apply reasonable technical and organisational safeguards, but no internet transmission or storage system is completely secure."] },
        { heading: "Your choices and rights", paragraphs: ["You may request access, correction or deletion of your personal information, object to or restrict certain processing, withdraw consent, or complain to an applicable data protection authority. Some records may be retained where legally required or needed to establish or defend claims."] },
        { heading: "Contact", paragraphs: ["For privacy questions or requests, email 18678695200@163.com. We may ask for reasonable information to verify your identity before responding."] },
      ],
    },
    zh: {
      title: "隐私政策",
      intro: "更新日期：2026年7月16日。本政策说明 ChinaChemExport 如何处理通过本网站提交的个人信息。",
      sections: [
        { heading: "我们收集的信息", paragraphs: ["我们可能收集姓名、商务邮箱、公司名称、电话或即时通讯方式、所需产品、数量、目的地、包装要求、询盘内容，以及浏览页面、浏览器类型、大致地区和访问来源等网站技术数据。"] },
        { heading: "信息用途", paragraphs: ["我们使用相关信息回复询盘、准备报价、评估产品供应及出口可行性、协调合规与物流、预防滥用、改进网站并保存必要的业务记录。"] },
        { heading: "处理依据", paragraphs: ["根据您所在地区，处理依据可能包括您要求的订约前措施、履行合同、合法商业利益、法定义务，或您对可选分析 Cookie 的同意。"] },
        { heading: "服务商与跨境处理", paragraphs: ["我们使用 Supabase 存储数据库及文件、Resend 发送事务邮件，并在获得同意后使用 Google Analytics，同时使用托管和 DNS 服务。数据可能在您所在国家以外（包括中国和美国）处理，并受适用保障措施及服务商条款约束。"] },
        { heading: "保存与安全", paragraphs: ["询盘及业务记录仅在报价跟进、合同履行、合规、争议处理和财务要求所合理需要的期限内保存。我们采取合理的技术和组织措施，但任何互联网传输或存储系统均无法保证绝对安全。"] },
        { heading: "您的选择与权利", paragraphs: ["您可请求访问、更正或删除个人信息，对特定处理提出异议或限制，撤回同意，或向适用的数据保护机构投诉。若法律要求或为建立、行使及抗辩权利所需，部分记录可能继续保存。"] },
        { heading: "联系我们", paragraphs: ["隐私问题或请求请发送至 18678695200@163.com。处理请求前，我们可能要求提供合理信息以验证身份。"] },
      ],
    },
  },
  terms: {
    en: {
      title: "Terms of Use",
      intro: "Last updated: July 16, 2026. By using this website, you agree to these terms. Separate signed sales contracts and quotations govern actual transactions.",
      sections: [
        { heading: "Website information", paragraphs: ["Product descriptions, specifications, packing, applications, availability, lead times and logistics information are general references and may change. Website content is not a binding offer, warranty, safety instruction or regulatory approval."] },
        { heading: "Quotations and contracts", paragraphs: ["A transaction is binding only when the parties confirm it in a written quotation, proforma invoice, purchase order acceptance or signed contract. Prices, Incoterms, payment, inspection, documentation, delivery, claims and liability are governed by those transaction documents."] },
        { heading: "Permitted use", paragraphs: ["You may use the website for lawful business evaluation and inquiries. You must not interfere with the website, attempt unauthorised access, submit false information, scrape at disruptive scale, introduce malicious code, or use content in violation of law or third-party rights."] },
        { heading: "Buyer responsibilities", paragraphs: ["Buyers must independently confirm product suitability, specifications, end use, licences, sanctions and trade restrictions, import requirements, taxes, safe handling, storage, transport and disposal obligations in all relevant jurisdictions."] },
        { heading: "Intellectual property and external services", paragraphs: ["Website text, design, branding and original materials are protected by applicable intellectual-property laws. Third-party names and materials belong to their owners. Links and external services are provided for convenience and remain subject to their own terms."] },
        { heading: "Disclaimer and limitation", paragraphs: ["The website is provided on an “as available” basis. To the extent permitted by law, we exclude implied warranties relating to website content and are not liable for indirect, incidental or consequential loss arising solely from use of, or inability to use, the website."] },
        { heading: "Changes and contact", paragraphs: ["We may update these terms when the website, services or laws change. Questions may be sent to 18678695200@163.com."] },
      ],
    },
    zh: {
      title: "使用条款",
      intro: "更新日期：2026年7月16日。使用本网站即表示您同意本条款。实际交易以双方的正式报价及签署文件为准。",
      sections: [
        { heading: "网站信息", paragraphs: ["产品说明、规格、包装、用途、供应情况、交期及物流信息仅供一般参考，可能随时调整。网站内容不构成有约束力的要约、保证、安全操作指引或监管批准。"] },
        { heading: "报价与合同", paragraphs: ["交易仅在双方通过书面报价、形式发票、采购订单确认或正式合同确认后具有约束力。价格、贸易术语、付款、检验、单证、交付、索赔及责任以相应交易文件为准。"] },
        { heading: "允许的使用", paragraphs: ["您可将网站用于合法的商业评估和询盘。不得干扰网站、未经授权访问、提交虚假信息、进行影响服务的批量抓取、植入恶意代码，或以违反法律及第三方权利的方式使用内容。"] },
        { heading: "买方责任", paragraphs: ["买方应独立确认产品适用性、规格、最终用途、许可、制裁及贸易限制、进口要求、税费，以及相关司法辖区内的安全操作、储存、运输和处置义务。"] },
        { heading: "知识产权与外部服务", paragraphs: ["网站文字、设计、品牌及原创材料受适用知识产权法律保护。第三方名称和材料归其权利人所有。外部链接与服务仅为便利提供，并受其自身条款约束。"] },
        { heading: "免责声明与责任限制", paragraphs: ["网站按“现状及可用状态”提供。在法律允许范围内，我们不对网站内容作默示保证，也不对仅因使用或无法使用网站产生的间接、附带或后果性损失承担责任。"] },
        { heading: "更新与联系", paragraphs: ["网站、服务或法律变化时，我们可能更新本条款。问题请发送至 18678695200@163.com。"] },
      ],
    },
  },
  cookies: {
    en: {
      title: "Cookie Policy",
      intro: "Last updated: July 16, 2026. This policy explains the browser storage and analytics technologies used on this website.",
      sections: [
        { heading: "Essential storage", paragraphs: ["The website uses local browser storage to remember language and analytics-consent choices. This supports requested website functions and is not used for advertising."] },
        { heading: "Google Analytics", paragraphs: ["With your consent, Google Analytics measures page views, approximate location, device and browser information, referral sources and successful inquiry events. The measurement ID is G-LX6Z6RLDEP. Advertising storage, ad user data and ad personalisation are disabled by default."] },
        { heading: "Consent choices", paragraphs: ["Analytics storage is denied by default. Selecting “Accept analytics” grants analytics storage; selecting “Decline” keeps it denied. You may reopen Cookie Settings from the website footer and change your choice."] },
        { heading: "Third-party information", paragraphs: ["Google may process analytics data under its own terms and privacy documentation. Browser settings can also block or delete cookies and local storage, although doing so may reset website preferences."] },
        { heading: "Contact", paragraphs: ["Questions about website tracking may be sent to 18678695200@163.com."] },
      ],
    },
    zh: {
      title: "Cookie 政策",
      intro: "更新日期：2026年7月16日。本政策说明网站使用的浏览器存储和分析技术。",
      sections: [
        { heading: "必要存储", paragraphs: ["网站使用浏览器本地存储记住语言及分析同意选择，以提供您要求的网站功能，不用于广告投放。"] },
        { heading: "Google Analytics", paragraphs: ["经您同意后，Google Analytics 会衡量页面访问、大致地区、设备及浏览器信息、访问来源和询盘成功事件。衡量 ID 为 G-LX6Z6RLDEP。广告存储、广告用户数据和广告个性化默认关闭。"] },
        { heading: "同意选择", paragraphs: ["分析存储默认拒绝。选择“Accept analytics”将允许分析存储；选择“Decline”则继续拒绝。您可通过网站页脚的 Cookie Settings 重新打开设置并更改选择。"] },
        { heading: "第三方信息", paragraphs: ["Google 可能根据其自身条款及隐私文件处理分析数据。您也可通过浏览器设置阻止或删除 Cookie 和本地存储，但这可能会重置网站偏好。"] },
        { heading: "联系我们", paragraphs: ["网站追踪相关问题请发送至 18678695200@163.com。"] },
      ],
    },
  },
  "dangerous-goods": {
    en: {
      title: "Dangerous Goods Disclaimer",
      intro: "Chemical products may be hazardous and may be regulated differently by product, concentration, packing, transport mode, route, destination and intended use.",
      sections: [
        { heading: "General information only", paragraphs: ["Website references to hazard classes, UN numbers, packing, applications or logistics are preliminary information only. They do not replace the current Safety Data Sheet (SDS), certificate of analysis, classification report, transport document, label, competent-authority decision or professional advice."] },
        { heading: "Classification and documentation", paragraphs: ["Final classification and documentation must be confirmed for the exact product, composition, quantity, packing and shipment. Requirements may include the UN Model Regulations, IMDG Code, IATA Dangerous Goods Regulations, ADR/RID/ADN and applicable national or port rules."] },
        { heading: "Customer and supply-chain duties", paragraphs: ["Each manufacturer, consignor, shipper, packer, carrier, consignee, importer, distributor, employer and end user remains responsible for the duties assigned to its role. Customers must disclose the intended use and destination accurately and obtain required permits and approvals."] },
        { heading: "No consumer or unauthorised use", paragraphs: ["Products are offered for legitimate commercial or industrial use by appropriately qualified organisations. Do not purchase, handle, store, transport, mix, repackage, resell or dispose of chemicals without suitable training, facilities, protective equipment and legal authority."] },
        { heading: "Emergency and product-specific advice", paragraphs: ["In an exposure, spill, fire or transport emergency, follow the product SDS and local emergency procedures and contact the competent emergency services. Request the current product-specific SDS and shipping assessment before ordering."] },
      ],
    },
    zh: {
      title: "危险化学品免责声明",
      intro: "化学品可能具有危险性，其监管要求可能因产品、浓度、包装、运输方式、路线、目的地和最终用途而不同。",
      sections: [
        { heading: "仅供一般参考", paragraphs: ["网站中涉及危险类别、UN 编号、包装、用途或物流的内容仅为初步参考，不能替代最新安全数据表（SDS）、分析证书、分类报告、运输文件、标签、主管机关决定或专业意见。"] },
        { heading: "分类与文件", paragraphs: ["最终分类及文件必须根据具体产品、组成、数量、包装和运输方案确认。适用要求可能包括联合国《关于危险货物运输的建议书》、IMDG Code、IATA 危险品规则、ADR/RID/ADN，以及目的国、港口和当地法规。"] },
        { heading: "客户与供应链责任", paragraphs: ["制造商、托运人、发货人、包装人、承运人、收货人、进口商、经销商、雇主和最终用户应分别承担其角色对应的责任。客户必须准确披露最终用途和目的地，并取得所需许可及批准。"] },
        { heading: "禁止消费者或未经授权使用", paragraphs: ["产品仅面向具备相应资质的机构用于合法商业或工业用途。未具备适当培训、设施、防护设备和法律授权，不得购买、操作、储存、运输、混合、重新包装、转售或处置化学品。"] },
        { heading: "紧急情况与产品资料", paragraphs: ["发生接触、泄漏、火灾或运输紧急情况时，应遵循产品 SDS 和当地应急程序，并联系主管应急机构。下单前请索取最新的产品专用 SDS 及运输评估。"] },
      ],
    },
  },
};
