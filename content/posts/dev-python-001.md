+++
title = 'Python 累積和'
date = 2026-03-14
tags = ["dev", "python", "algorithm"]
categories = ["技術"]
draft = false
+++

pythonで累積和の問題を解いていたとき、実行時間が遅くエラー判定になったので整理しておく。2つのコードの違いは「**毎回計算**する」か「**あらかじめ計算**する」である。  
私が書いたコードはクエリごとに `A[0] + A[1] + ... + A[t-1]` を毎回計算する必要があり、全体で `O(n × k)` の計算量になる。  
例えば  
クエリ1：A[0]〜A[999]  
クエリ2：A[0]〜A[1000]  
であるとき、A[0]〜A[999] をまた最初から計算し直していることになる。  
模範解答では累積和を事前に作ることで、全体で `O(n + k)` の計算量にすることが出来る。

## 私の回答
```python
N, K = map(int, input().split())

A = [int(input()) for _ in range(N)]

for _ in range(K):
    t = int(input())
    ans = 0
    for i in range(t):
        ans += A[i]
    print(ans)
```

## 模範解答
```python
N, K = map(int, input().split())
A = [int(input()) for _ in range(N)]

ans = [0] + A[:]
for i in range(1, N + 1):
    ans[i] += ans[i - 1]

for _ in range(K):
    q = int(input())
    print(ans[q])
```


