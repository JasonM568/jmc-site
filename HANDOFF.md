# HANDOFF — 陳孟宏個人網站（jmc-site）

> 這份文件是「接手說明書」：任何人（或新的 AI session）看完就能接手繼續做。
> 每次「收工」時會更新這份文件的〈目前狀態〉與〈待辦〉。最後更新：2026-07-01

---

## 一句話說明

陳孟宏的個人品牌網站（AI 導入策略顧問 × Vibe Coding 家教），含形象首頁、Markdown 專欄、諮詢表單通知信、電子報索取乾貨。

## 正式網址

- 主網址：https://jing-ho.tw
- www：https://www.jing-ho.tw
- Vercel 預設：https://jmc-site-three.vercel.app
- 專欄：https://jing-ho.tw/columns

## 技術架構

- **框架**：Next.js 16.2.9（App Router, Turbopack）+ React 19
- **樣式**：Tailwind CSS v4 + @tailwindcss/typography（暖色系：奶油底 `#FFFBF5`、橘 `orange` / 石 `stone`）
- **內容**：專欄用 Markdown（`gray-matter` + `marked`）
- **部署**：Vercel（team scope：`tjs-projects-435187fd`）
- **Git**：GitHub `JasonM568/jmc-site`，**已連 Vercel Git 整合 → push 到 `main` 自動部署**

## 本機位置

- 專案：`/Users/jasonmchen/claude-孟宏部落格/jmc-site`
- 開發：`npm run dev`（http://localhost:3000）
- 建置檢查：`npm run build`

---

## 功能狀態

| 功能 | 狀態 | 備註 |
|------|------|------|
| 網站上線 + 自定網址 + SSL | ✅ 完成 | jing-ho.tw（DNS 在 GoDaddy，A `@`→76.76.21.21、CNAME `www`→cname.vercel-dns.com） |
| GitHub 自動部署 | ✅ 完成 | push `main` 即自動部署 |
| 形象首頁 | ✅ 完成 | Hero/About/Services/Course/Testimonials/Newsletter/Contact |
| 專欄（Markdown 部落格） | ✅ 完成 | `/columns` 列表 + `/columns/[slug]` 內頁 |
| 諮詢表單 → 寄通知信 | ✅ 完成 | Resend 寄到 `jyuli780@gmail.com` |
| 電子報 / 索取乾貨 | ⏳ 程式完成，未接平台 | 等 MailerLite API key |
| 乾貨 PDF | ⏳ 未提供 | 目前用 placeholder 名稱《AI 導入實戰檢查清單》 |

---

## 關鍵檔案地圖

```
app/
  page.tsx                      首頁（Hero/About/Services/Course/Testimonials/Contact 等區塊）
  layout.tsx                    全站 metadata、字型
  globals.css                   Tailwind + typography 外掛
  components/
    Navbar.tsx                  共用導覽列（含「專欄」連結）
    Footer.tsx                  共用頁尾
    Newsletter.tsx              電子報／索取乾貨區塊（前端表單）
  columns/
    page.tsx                    專欄列表頁
    [slug]/page.tsx             專欄內頁
  api/
    contact/route.ts            諮詢表單 → Resend 寄信
    subscribe/route.ts          電子報 → MailerLite 訂閱
lib/
  columns.ts                    讀取／解析 content/columns/*.md
content/columns/
  *.md                          專欄文章（每篇一個檔）
  README.md                     專欄寫作格式指南（不會變成文章）
```

---

## 環境變數（值不寫在 repo 裡）

本機在 `.env.local`（已被 git 忽略）；正式站在 Vercel Production 環境變數（加密）。

| 變數 | 用途 | 已設定？ |
|------|------|---------|
| `RESEND_API_KEY` | Resend 寄信金鑰 | ✅ 本機 + Vercel |
| `CONTACT_TO` | 諮詢通知收件信箱（jyuli780@gmail.com） | ✅ |
| `CONTACT_FROM` | 寄件者（`noreply@huibang.com.tw`，已驗證網域） | ✅ |
| `MAILERLITE_API_KEY` | 電子報平台金鑰 | ❌ 待提供 |
| `MAILERLITE_GROUP_ID` | 電子報訂閱群組（選填） | ❌ |
| `NEXT_PUBLIC_LEAD_MAGNET_URL` | 乾貨直接下載連結（選填） | ❌ |

> 備註：Resend 免費方案只能驗證 1 個網域，`jing-ho.tw` 加不進去，因此改用帳號內已驗證的 `huibang.com.tw` 當寄件網域（此信只寄給站長本人，網域不同不影響）。

---

## 常見操作

**新增一篇專欄文章**
1. 在 `content/columns/` 新增 `.md` 檔，檔名即網址（英文/拼音、小寫、用 `-`）
2. 檔案最上方填 frontmatter（title / date / excerpt / tags），格式見 `content/columns/README.md`
3. `git add . && git commit -m "新增專欄：xxx" && git push` → 幾分鐘後自動上線

**改內容 / 版面**：改檔 → `git push` 即自動部署。

**更新環境變數後生效**：`git commit --allow-empty -m "redeploy" && git push`（或 Vercel 後台 Redeploy）。

---

## 待辦（TODO）

1. **電子報接 MailerLite**：註冊 → 拿 API token（+ 建群組拿 Group ID）→ `vercel env add MAILERLITE_API_KEY production` → 重新部署 → 在 MailerLite 設「加入群組就寄乾貨」的自動化。
2. **乾貨 PDF**：準備好後，換掉 `app/components/Newsletter.tsx` 裡的 `LEAD_MAGNET_TITLE`；若要直接下載按鈕，設 `NEXT_PUBLIC_LEAD_MAGNET_URL`。
3. **專欄內容**：目前只有 2 篇範例文，陸續補上真正的知識乾貨。
4.（可選）諮詢通知信如果想用 `@jing-ho.tw` 當寄件者，需升級 Resend 方案或改用其他寄信服務。

---

## 「收工」流程

當使用者輸入「收工」時，AI 要依序做：
1. 把本次工作寫進 `WORKLOG.md`（日期 + 做了什麼 + 決策原因 + 未完成事項）
2. 更新本檔 `HANDOFF.md` 的〈目前狀態／功能狀態〉與〈待辦〉
3. 若有未 commit 的變更 → commit + push（訊息簡述本次工作）
4. 回報：本次完成什麼、待辦剩什麼、下次從哪裡接手
5. 明確標出任何卡住的事項或需要使用者提供的東西（如 API key、檔案）

詳細定義見 `WORKLOG.md` 開頭與此節。
