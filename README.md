# サロン売上管理ダッシュボード

## ✅ 無料でビルドする方法（GitHub Actions）

### 必要なもの
- GitHubアカウント（無料）: https://github.com

---

### 手順

#### 1. GitHubに新しいリポジトリを作る
1. https://github.com/new を開く
2. Repository name: `salon-app`（任意）
3. **Private** を選択（データを非公開にする場合）
4. 「Create repository」をクリック

#### 2. このzipの中身をアップロード
リポジトリのページで「uploading an existing file」をクリックし、
zip展開後の**全ファイル・フォルダ**をまとめてドラッグ＆ドロップ。
「Commit changes」をクリック。

#### 3. ビルドが自動スタート
アップロードすると自動的にビルドが始まります。
「Actions」タブで進捗を確認できます（5〜10分ほど）。

#### 4. 完成ファイルをダウンロード
Actionsタブ → 完了したワークフロー → 下部の「Artifacts」から
- `windows-installer` → `.exe`（Windowsインストーラー）
- `mac-dmg` → `.dmg`（Macインストーラー）

をダウンロードできます。

---

### 手動でビルドを再実行したい場合
Actions タブ → 「Build Desktop App」→「Run workflow」ボタン

---

### ローカルでの動作確認（Node.js 18+が必要）
```
npm install
npm start
```
