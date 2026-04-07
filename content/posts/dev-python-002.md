+++
title = 'Python 二次元区間和'
date = 2026-04-02
tags = ["dev", "python", "sum"]
categories = ["技術"]
image = 'images/image-04.png'
draft = false
+++

今回の問題は「二次元区間和」である。H 行 W 列 の行列 A があり、2 つの行・列番号の組 {a , b} , {c , d} における区間和 S({a,b} , {c,d}) (a ≦ c , b ≦ d) を以下のように定義する。

`S({a,b} , {c,d}) = A[a][b] + A[a][b+1] + ... + A[a][d] + A[a+1][1] + ... + A[a+1][d] + ... + A[c][1] + ... + A[c][d]`

各クエリの累積和を問題文で与えられた計算式の通り計算を行うと実行時間制限に間に合わないため、事前に値を計算したり既に計算した値を再利用したりすることで、計算量を落とすことが有効的と言える。

`ans[i][j] += ans[i - 1][j] + ans[i][j - 1] - ans[i - 1][j - 1]`  
は以下の数学的処理を行っている。
- `ans[i-1][j]` : &nbsp; 一行上までの合計

- `ans[i][j-1]` : &nbsp; 一列左までの合計

- `ans[i-1][j-1]` : &nbsp; 重複して足してしまった左上のエリアを引く

<div class="button_line" style="margin-top: 40px; border-top: 1px solid #a855f7; padding-top: 20px;">

また、本来であれば A[0][j] は一行上を参照できず、a[i][0] は一列左を参照できないことから `ans[i-1][j]` と `ans[i][j-1]` は **例外処理** になるが、上と左に要素 0 を 1 行 1 列追加することで、「合計は0」として if 文の分岐などを使用しなくて済む。

`ans = [[0] * (W + 1) for _ in range(H + 1)]`  

具体的には以下で例外処理として計算しなくて済む。
- ans[i-1][j] の i が 1 のとき &nbsp; ( <---> &nbsp; ans[0][j]) 
- ans[i][j-1] の j が 1 のとき &nbsp; ( <---> &nbsp; ans[i][0]) 

## 模範解答
```python
H, W, N = map(int, input().split())
A = [[int(x) for x in input().split()] for _ in range(H)]

ans = [[0] * (W + 1) for _ in range(H + 1)]
for i in range(1, H + 1):
    ans[i] = [0] + A[i - 1][:]
    for j in range(1, W + 1):
        ans[i][j] += ans[i - 1][j] + ans[i][j - 1] - ans[i - 1][j - 1]

for _ in range(N):
    a, b, c, d = map(int, input().split())

    val = ans[c][d]
    if 0 < a and 0 < b:
        val += ans[a - 1][b - 1]
    if 0 < a:
        val -= ans[a - 1][d]
    if 0 < b:
        val -= ans[c][b - 1]

    print(val)
```


