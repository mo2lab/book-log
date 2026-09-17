# 読書記録アプリ

読んだ本を登録して、感想を残しておけるアプリです。

## 公開URL
https://book-log-blush.vercel.app/

## 画面

一覧
<img width="1080" height="407" alt="一覧画面" src="https://github.com/user-attachments/assets/9a62dce3-aeea-4e61-81fe-8e88d7b61a04" />

登録フォーム
<img width="1080" height="577" alt="登録フォーム画面" src="https://github.com/user-attachments/assets/0974b055-767d-49f2-928c-8a6c84708a90" />

## 使用技術
- Next.js 16.3.4 (App Router) / TypeScript 5
- React 19.2.8
- Tailwind CSS 4 / shadcn/ui（Base UI）
- Supabase (PostgreSQL)
- Vercel

## 工夫した点
- データ取得を Server Components、更新処理を Server Actions で行い、
  クライアント側の状態管理を持たない構成にしました。
- iPhone SE (375px) での表示崩れがないことを確認しています。

## 注意
学習用のため、データベースは誰でも読み書きできる設定になっています。
