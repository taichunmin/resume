# jsonresume

<https://jsonresume.org/>

## 更新方法

直接更新到這個 GitHub Gist: <https://gist.github.com/taichunmin/5521c4d0e9dab5303a8e02f2bd0fcc5e>

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
