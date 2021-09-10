# reilas_append_eight_note
Tokai kinensai 2021

# 導入方法
## gitのインストール
調べながら入れてください。
## clone
git bashのインストールしたいディレクトリで
```
git clone https://github.com/Sora513/reilas_append_eight_note.git
```
または、zipファイルをダウンロードして解凍

## nodeJSのインストール
調べながら入れてください。LTSでかまいません。
node -vで、バージョンが出てきたら成功です。

# 使用方法
## 譜面の登録
プロジェクト内のsourceディレクトリに、8分判定を追加したい譜面(jsonファイル)を入れるだけでかまいません。
## 実行
何らかのターミナル(git bashなど)で、プロジェクトのディレクトリに移動して
```
node main.js
```
で実行できます。
## ファイルの出力場所
プロジェクト内のresultディレクトリにenp_XXXXX.jsonが生成されています。
