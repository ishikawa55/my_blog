+++
title = 'XSSの脅威'
date = 2026-03-01
tags = ["Security", "Hugo", "XSS"]
categories = ["技術"]
image = 'images/image-05.png'
draft = false
+++

サイトカスタマイズをしていたところ、セキュリティの壁に当たったので記録しておく。

## チェックボックスを表示

自己紹介ページに「最近のタスク」を示すチェックボックスを作ろうとした時のことだ。Markdown記法でチェックボックスを作成するとビュレットが表示されてしまい、デザインに欠ける。

- [x] 十分な**睡眠**と適切な**飲酒**
- [ ] 読書

そこで、HTMLを直接埋め込むことで改善を試みた。

<!-- <div style="text-align: center; margin: 1.5rem 0;"> -->
  <div style="display: inline-block; text-align: left;">
    <label style="display: block; margin-bottom: 0.5rem;">
      <input type="checkbox" class="nes-checkbox" checked disabled />
      <span>十分な<b>睡眠</b>と適切な<b>飲酒</b></span>
    </label>
    <label style="display: block;">
      <input type="checkbox" class="nes-checkbox" disabled />
      <span>読書</span>
    </label>
  </div>
<!-- </div> -->

## Markdown で HTML を作動させる

HugoのMarkdownレンダラーである「Goldmark」の安全装置が働いていて、直接HTMLを書き込んでも反映されない。HTMLの使用を許可するには、`hugo.toml` に以下の設定を追記する。

```toml
[markup.goldmark.renderer]
    unsafe = true
```

## なぜ Hugo は HTML を無視するのか？

Hugoはパーサーとして「Goldmark」を採用している。「Goldmark」はMarkdownレンダラーの一種で、標準設定で**Markdown内のHTML**は安全ではないとして除去されるようになっている。これには**XSS**という非常に重要な脆弱性を防ぐ意図がある。

## XSS（クロスサイトスクリプティング）とは何か

**XSS**とは、サイトの脆弱性を突いて攻撃者が埋め込んだ悪意あるスクリプトを、閲覧者のブラウザ上で実行させる**サイバー攻撃**のことだ。もし、不特定多数が記事を投稿できるサイトで **HTMLを無効化（サニタイズ）** していなかったらどうなるか？悪意のある者が、以下のようなコードを紛れ込ませるかもしれない。

```html
<img src="invalid" onerror="alert(`セッション情報を盗みました: ` + document.cookie);">
```

このスクリプトは、、、  
1. `src="invalid"`（存在しない画像パス）を指定することで、わざと読み込みエラーを発生させる。
2. エラーが起きる、`onerror` 属性に書かれたJavaScriptが作動する。
3. この例では `alert` が出るだけだか、実際は `document.cookie`（セッション情報など）を攻撃者のサーバーへ送信させるようなコードが書かれることが多い。

## 総括

今回のケースでは **「自分で自分のサイトにHTMLを書く」** ためリスクはほぼない。これはMarkdown内に直接以下のような外部JSを書いた場合に、その提供元がハッキングされると結果的に悪意のあるコードが実行されてしまうということであり、**実質的なリスクはほぼない**という意味である。

```html
<script src="https://example.com/widget.js"></script>
```

不特定多数がコメントを残せるようなサイトであれば、この **「HTMLの無効化」** は絶対に欠かせない防衛ラインとなる。利便性と安全性のトレードオフをどう管理するか、難しい課題だと感じた。
