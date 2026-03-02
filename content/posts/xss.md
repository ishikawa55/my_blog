+++
title = '「unsafe = true」の裏側にあるXSSの脅威'
date = 2026-03-01T02:05:30+09:00
tags = ["Security", "Hugo", "XSS"]
categories = ["技術"]
draft = false
+++

サイトカスタマイズをしていたところ、セキュリティの壁に当たったので記録しておく。

## ドット絵のチェックボックスを表示

「ishikawaの酒場」のフロントページに、現在の活動状況を示すチェックボックスを作ろうとした時のことだ。Markdown記法でチェックボックスを作成するとビュレットが表示されてしまい、デザインに欠ける。（以下参照）

- [x] 十分な**睡眠**と適切な**飲酒**
- [ ] **Python**の学習（Djangoも含む）
- [ ] **情報セキュリティ**の学習

そこで、HTMLを直接埋め込むことでドットのチェックボックスにブラッシュアップできた。（以下参照）

<!-- <div style="text-align: center; margin: 1.5rem 0;"> -->
  <div style="display: inline-block; text-align: left;">
    <label style="display: block; margin-bottom: 0.5rem;">
      <input type="checkbox" class="nes-checkbox" checked disabled />
      <span>十分な<b>睡眠</b>と適切な<b>飲酒</b></span>
    </label>
    <label style="display: block;">
      <input type="checkbox" class="nes-checkbox" disabled />
      <span><b>Python</b>の学習（Djangoも含む）</span>
    </label>
    <label style="display: block;">
      <input type="checkbox" class="nes-checkbox" disabled />
      <span><b>情報セキュリティ</b>の学習</span>
    </label>
  </div>
<!-- </div> -->

## Markdown で HTML を作動させる

NES.cssのレトロなチェックボックスを使おうとMarkdownに直接HTMLを書き込んでも、ビルドしてみると反映されない。原因は、Hugoの標準Markdownレンダラーである「Goldmark」の安全装置が働いていたからだ。HTMLの使用を許可するには、`hugo.toml`に以下の設定を追記する。

```toml
[markup.goldmark.renderer]
    unsafe = true
```

## なぜ Hugo は HTML を無視するのか？

Hugoはパーサーとして「Goldmark」を採用している。「Goldmark」はMarkdownレンダラーの一種で、標準設定で**Markdown内のHTML**は安全ではないとして除去されるようになっている。これには**XSS**という非常に重要な脆弱性を防ぐ意図がある。

## XSS（クロスサイトスクリプティング）とは何か

**XSS**とは、サイトの脆弱性を突いて攻撃者が**悪意のあるスクリプト**を埋め込み、それを閲覧したユーザーのブラウザで実行させる**サイバー攻撃**のことだ。もし、不特定多数が記事を投稿できるサイトで **HTMLを無効化（サニタイズ）** していなかったらどうなるか？悪意のある者が、以下のようなコードを紛れ込ませるかもしれない。

```html
<img src="invalid" onerror="alert('セッション情報を盗みました: ' + document.cookie);">
```

このスクリプトは、、、  
1. `src="invalid"`（存在しない画像パス）を指定することで、わざと読み込みエラーを発生させる。
2. エラーが起きる、`onerror`属性に書かれたJavaScriptが作動する。
3. この例では`alert`が出るだけだか、実際は`document.cookie`（セッション情報など）を攻撃者のサーバーへ送信させるようなコードが書かれることが多い。

## 総括

今回のケースでは **「自分で自分のサイトにHTMLを書く」** ためリスクは低い。不特定多数がコメントを残せるようなサイトであれば、この **「HTMLの無効化」** は絶対に欠かせない防衛ラインとなる。利便性と安全性のトレードオフをどう管理するか、難しい課題だと感じた。
