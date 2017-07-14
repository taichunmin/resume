# jsonresume

<https://jsonresume.org/>

## 更新指令

```bash
npm install -g resume-cli
resume login
resume publish
```

## 生成 PDF 版

1. 先透過 Chrome Developer Tools 開啟 print 模擬 <https://stackoverflow.com/questions/9540990/using-chromes-element-inspector-in-print-preview-mode/>
2. 手動改掉任何不想要的 CSS

```CSS
/* Flat Theme 讓特定超連結不要出現連結內容 */
@media print {
  .website>a[href]:after {
      content: "";
  }
}
/* 想要印出來的 color 全部使用 !important 來指定 */
```
