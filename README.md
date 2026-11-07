# 論文閱讀筆記站

雲科大資工碩一的個人論文閱讀筆記。每篇論文用同一套九區塊格式整理，部署在 GitHub Pages。

- 網站：`https://<你的 GitHub 帳號>.github.io/<repo 名稱>/`
- AI 工作說明書：[`CLAUDE.md`](CLAUDE.md)

## 專案結構

```
├── CLAUDE.md               AI 工作說明書（規則、格式、流程）
├── index.html              首頁（讀 data/papers.json 產生卡片）
├── about.html              關於本站
├── data/papers.json        論文清單
├── papers/                 每篇論文一頁
├── templates/              筆記頁空白模板
└── assets/                 樣式、腳本、圖片
```

## 本機預覽

首頁需要讀取 JSON，請用本機伺服器開啟，不要直接雙擊 HTML：

```bash
python -m http.server 8000
# 開啟 http://localhost:8000
```

## 用 AI 新增一篇論文

1. 把論文 PDF 放進專案資料夾（或直接附給 AI）。
2. 在專案根目錄啟動 Claude Code（會自動讀取 `CLAUDE.md`），輸入：

   ```
   照 CLAUDE.md 的規則，新增這篇論文：<PDF 檔名>
   ```

3. AI 會依 `CLAUDE.md` 第 9 節的流程：建立 `papers/<id>.html`、更新 `data/papers.json`、補上相關論文的雙向連結，並回報待確認的內容。
4. 自己檢查數字與「優點與限制」「與我研究的關聯」兩個草稿區塊，確認後把 `papers.json` 裡的 `status` 改成 `"reviewed"`。
5. 刪除 PDF（不要把論文 PDF 上傳到公開 repo），然後 `git push`。

## 部署到 GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit: paper notes site"
git branch -M main
git remote add origin https://github.com/<帳號>/<repo>.git
git push -u origin main
```

接著到 repo 的 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 **main / (root)**，儲存後約一分鐘網站就會上線。

## 目前收錄

| 論文 | 發表處 |
|---|---|
| InvCoSS | CVPR 2026 |
| RESAM | IEEE TNSRE 2024 |
| PraNet-V2 | Computational Visual Media 2026 |
