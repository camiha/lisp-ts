# lisp-ts

Tiny Lisp interpreter. written in TypeScript.

## Setup

-   set node version: `16 >=`
-   `npm install` for install dependencies
-   `npm start` for run repl

## REPL

### basic operations

```Shell
  lisp-ts> (+ 1 (- 2 (* 3 (/ 4))))
  -9

  lisp-ts> (&& (|| false true) (> 1 0))
  true
```

### setq

```Shell
  lisp-ts> (setq x 5)
  true

  lisp-ts> x
  5

  lisp-ts> (+ x x)
  10
```

### defun

```Shell
  lisp-ts> (defun fn (x) (* x x))
  true

  lisp-ts> (fn 2)
  4
```

recursive function

```Shell
  lisp-ts> (defun fact (n) (if (== n 0) 1 (* n (fact (- n 1)))))
  true

  lisp-ts> (fact 5)
  120
```

## Respect

Create interpreter is one of awesome experience in my programming life.
thanks for next articles and all lisp programmers.

-   [Land of Lisp [book]](https://www.oreilly.com/library/view/land-of-lisp/9781593272814/)
-   [Little Lisp interpreter - Mary Rose Cook](https://maryrosecook.com/blog/post/little-lisp-interpreter)
-   [kanaka/mal - mal - Make a Lisp](https://github.com/kanaka/mal)
-   [Indy9000/lisper - Lisp Parser Interpreter written in TypeScript](https://github.com/Indy9000/lisper)
-   [(How to Write a (Lisp) Interpreter (in Python))](http://norvig.com/lispy.html)
    -   and translated article [((Python で) 書く (Lisp) インタプリタ)](http://www.aoky.net/articles/peter_norvig/lispy.htm)
-   [JavaScript で Web ブラウザ版 LISP 処理系を作ってみた](https://zenn.dev/ytaki0801/articles/042cfa374223b3a5c03c)
-   [JavaScript の ES2015 を使ったら Lisp を 100 行未満で実装できた](https://qiita.com/41semicolon/items/d59f00ebb70b14fdb4e3)

