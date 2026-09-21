# Habit Tracker

日々の習慣を記録し、継続を可視化するWebアプリケーションです。

バックエンドは Spring Boot、フロントエンドは Next.js、データベースは PostgreSQL を使用しています。

## 主な機能

- ユーザー登録・ログイン
- 習慣の作成・編集・削除
- 日ごとの記録の作成・編集・削除
- 2週間・月単位での記録表示
- 習慣ごとのテンプレート管理

## 使用技術

### Backend

- Java 25
- Spring Boot 4.1
- Spring Data JPA
- Spring Security
- PostgreSQL
- JWT

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## セットアップ

### 1. データベースの作成

PostgreSQLにデータベースを作成します。

```sql
CREATE DATABASE habit_tracker;
```

### 2. 環境変数の設定

`.env.example`を参考に、バックエンドを起動するシェルへ環境変数を設定します。
JWTの秘密鍵は以下コマンドなどを使用して作成して下さい。
```bash
openssl rand -base64 32
```

```env
JWT_SECRET=秘密鍵
DB_URL=jdbc:postgresql://localhost:5432/habit_tracker
DB_USERNAME=PostgreSQLのユーザー名
DB_PASSWORD=PostgreSQLのパスワード
```

### 3. バックエンドの起動

```bash
set -a
source .env
set +a
./mvnw spring-boot:run
```

バックエンドはデフォルトで `http://localhost:8080` に起動します。

Swagger UIは以下から確認できます。

```text
http://localhost:8080/swagger-ui/index.html
```

### 4. フロントエンドの起動

```bash
cd front
pnpm install
pnpm run dev
```

フロントエンドはデフォルトで `http://localhost:3000` に起動します。

バックエンドのURLを変更する場合は、フロントエンド側に `SPRING_API_URL` を設定してください。

```env
SPRING_API_URL=http://localhost:8080
```

## テスト

バックエンドのテストは次のコマンドで実行します。

```bash
./mvnw test
```

フロントエンドのLintは次のコマンドで実行します。

```bash
cd front
pnpm lint
```
