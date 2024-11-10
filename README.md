# MirageX（ミラージュ・クロス）α

MirageX は TypeScript×React で Resonite の開発を行えるフレームワークです。

[UniPocket](https://about.uni-pocket.com/ja)を作るために開発されました。
このリポジトリはUniPocketからMirageX部分を抽出して作られています。

現在は α 版であり破壊的な変更を頻繁にします。

サーバーサイドでメインロジックを動かし、Resonite では結果のみを表示するという仕組みになっています。
特殊な構成になるため、導入は慎重に検討してください。

主なメリット

- 以下の理由により、開発速度が早くなる。
  - React の作り方が使える。
  - 外部ライブラリが使える。
  - コードベースの開発ができる。
    - git が使える。
    - 再利用がしやすくなる。
- メインロジックを隠蔽できるため、ユーザーのチートを防ぎやすくなる。

主なデメリット

- 完成品にはインフラコストがかかる。
- ネットワークレイテンシーの影響を受ける。
- Resonite 上で改造できない。

## ローカル環境のセットアップ

### パッケージをインストール

以下のコマンドで依存モジュールをインストールします。

> npm install

### とりあえず動かす

> npm run dev

- Resonite オブジェクトが`./dist/res/src/output.brson`に生成されます。
- サーバーが起動します。
- これらはソースコードを変更すると自動で再生成・再起動します。

`./dist/res/src/output.brson`を Resonite のウィンドウにドラッグアンドドロップすると、サーバーと通信してサンプルが表示されます。

## メインロジック

メインロジックは`./src/core/main/`下に配置します。
React で動いています。

## Unit パッケージ

MirageX では Resonite と同期する際に、Unit という独自概念を最小単位としています。
Unit はユースケースに合わせてパッケージでまとめられています。
また、自分で作ることもできます。

### Unit を作る

`./src/core/unit/package/`下にパッケージのディレクトリを作ります。既存のパッケージを使ってもいいです。

`./src/core/unit/package/000_template/unitTemplateResFeedback`というテンプレートをコピーして、先程作ったパッケージのディレクトリ下に配置します。
またディレクトリ名は任意の Unit 名をつけます。

コピーしたテンプレート下にある`detail.ts`を編集します。
`detail.code`に他の Unit と衝突しない名前、`detail.propsConfig`に必要なプロパティを定義します。

以下のコマンドで各パッケージに Unit のインポート文を追加します。（Unit を新規追加・削除した後は実行してください。）

> npm run unitPackage:sync

新しいパッケージを作った場合は`./src/core/unit/main.ts`と`./src/core/unit/res.ts`に import する文を追記します。

以下のコマンドで`./dist/res/src/output.brson`を更新して、Resonite にドラッグアンドドロップしなおします。
（`npm run dev`を実行中であれば、以下を行わずとも変更を検知して自動で再生成されています。）

> npm run build:res

### Unit を Resonite で編集する

Resonite 上の編集をリポジトリにフィードバックさせることができます。
（正確には Resonite 側を優先する Slot とそうでない Slot があります。）

読み込んだ`./dist/res/src/output.brson`を編集して保存します。

#### config の設定

`.env`を作成します。（`.env.sample`が参考になります）
`FEEDBACK_LINK`に Resonite で保存したフォルダのリンクを入れます。
（パブリックフォルダにする必要があります。）

```
FEEDBACK_LINK=resrec:///U-xxx/xxx
```

#### 使い方

以下のコマンドで登録したフォルダから最新のオブジェクトを取得して、ユニットに適用します。
ユニットは`{パッケージ名}/{ユニット名}` で識別されます。

> npm run feedback:unit xxxx

正規表現を使用して複数のユニットを更新できます。
例：`npm run feedback:unit ^PrimitiveUix.*`
