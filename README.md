# ASH Hair Studio 預約系統

這是一個簡易的美髮預約前端頁面，使用 HTML + Tailwind CSS + 原生 JavaScript 製作。

## 功能
- 填寫顧客姓名、電話、服務項目、日期、時段與設計師。
- 自動檢查同設計師同時段衝突。
- 以 `localStorage` 保存預約資料。
- 可刪除單筆預約或一鍵清空。

## 使用方式
1. 直接用瀏覽器開啟 `index.html`。
2. 或透過簡易伺服器執行：
   ```bash
   python3 -m http.server 8000
   ```
3. 開啟 `http://localhost:8000`。
