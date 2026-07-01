# WORKLOG — 陳孟宏個人網站

> 工作紀錄，由新到舊。每次「收工」新增一則當日紀錄。
> 接手請先看 `HANDOFF.md`。

---

## 2026-07-01

### 完成

**網站上線**
- 從 `mhchenwebsite.zip` 解出 Next.js 專案，推上 GitHub `JasonM568/jmc-site`
- 部署到 Vercel（team `tjs-projects-435187fd`），啟用 GitHub Git 整合（push 自動部署）
- 串接自定網址 `jing-ho.tw` + `www`：GoDaddy 設 A `@`→76.76.21.21、CNAME `www`→cname.vercel-dns.com；SSL 憑證自動簽發完成
  - 過程排除過根網域殘留的 GoDaddy 停放頁 A 紀錄（15.197.148.33 / 3.33.130.190）

**專欄（Markdown 部落格）**
- 抽出共用 `Navbar` / `Footer` 元件，導覽列加入「專欄」
- `lib/columns.ts` 讀取解析 `content/columns/*.md`（gray-matter + marked）
- `/columns` 列表頁 + `/columns/[slug]` 內頁（含 SEO metadata、靜態產生）
- 加 `@tailwindcss/typography` 美化文章排版
- 附 2 篇範例乾貨文 + `content/columns/README.md` 寫作指南（README 已排除不變成文章）

**諮詢表單通知信**
- 原表單接 Formspree 佔位網址（無效），改成自建 `/api/contact`
- 用 Resend 寄通知信到 `jyuli780@gmail.com`，reply-to 設為訪客 email
- 本機 + 正式站都實測寄信成功

**電子報 / 索取乾貨（程式完成，未接平台）**
- `Newsletter.tsx` 前端區塊（首頁 + 專欄列表底部）
- `/api/subscribe` 串 MailerLite；未設金鑰時走 pending 模式不報錯

**交接機制**
- 建立 `HANDOFF.md`（接手說明書）與 `WORKLOG.md`（工作紀錄）
- 定義「收工」流程：更新 WORKLOG/HANDOFF → commit+push → 回報（並存成長期記憶，跨對話沿用）

### 關鍵決策
- **寄件網域**：Resend 免費方案限 1 個驗證網域，`jing-ho.tw` 加不進去 → 改用帳號內已驗證的 `huibang.com.tw`（`noreply@huibang.com.tw`）。此信只給站長，網域不同不影響。
- **敏感金鑰**：全部走環境變數（`.env.local` 本機、Vercel 加密），不寫進程式碼、不 commit。
- **電子報選 MailerLite**：免費額度大、能自動寄乾貨、之後可群發。

### 未完成 / 待接手
- MailerLite API key 未提供 → 電子報尚未真正收名單
- 乾貨 PDF 未提供 → Newsletter 用 placeholder 名稱《AI 導入實戰檢查清單》
- 專欄僅 2 篇範例，待補真實內容

### 下次從這裡接手
1. 拿到 MailerLite token → 設 `MAILERLITE_API_KEY`（+ `MAILERLITE_GROUP_ID`）→ 重新部署 → 設自動寄乾貨
2. 拿到乾貨 PDF → 換 `LEAD_MAGNET_TITLE`、視需要設 `NEXT_PUBLIC_LEAD_MAGNET_URL`
