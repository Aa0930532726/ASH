# ASH 預約頁面

此專案提供 ANH 髮廊的手機版預約頁面與 Netlify Function：

- `index.html`：前端預約表單（LIFF + LINE OA 跳轉）。
- `netlify/functions/notion-booking.js`：接收預約資料並寫入 Notion Database。

## 環境變數

請在 Netlify（或本機 `.env`）設定：

- `NOTION_TOKEN`：Notion integration token
- `NOTION_DATABASE_ID`：Notion database id

## 本機預覽

可使用任一靜態伺服器預覽 `index.html`。
