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

# 加えた情報と仕様

## guid
厳密には除算によってセキュアではありませんが、乱数生成機(crypto.randomFillSync)をしようして32文字のランダム文字列を生成しています。
万が一衝突が起こった場合は、もう一度変換を行ってください。その際、resultのファイルを上書きするので、消去する必要はありません。

## editorProps.time
measureIndexと、measurePositionから計算して入れています。

## measureIndex,measurePosition
headに指定されたものに、1/8ずつ加算しています。

## horizontalSize
計算して、小数点以下を切り捨てています。

## horizontalPosition
計算して入れていますが、分数計算に入れて近似などを行っていないため、分母が肥大化している場合があります。9007199254740991を超える数値は言語仕様上うまく計算ができないので、必要があれば修正します。

## type
hold-judge-noteと、above-slide-judge-noteを追加しました。

## speed,lane,layer
headに指定されたnotesのデータをそのまま引き継いでいます。

## そのほか仕様
ファイル全体に時間を昇順でソートをかけています。
デバッグや最適化は行っていないので、何か問題があればissueに共有してください。

