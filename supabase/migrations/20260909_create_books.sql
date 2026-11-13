-- Supabase の SQL Editor で手動実行した SQL の記録（Supabase CLI は使っていない）。
-- 認証機能を追加する前の、最初のテーブル作成。

-- 書籍管理テーブルの作成
create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  status text not null default '未読',
  rating int,
  memo text,
  created_at timestamptz not null default now()
);

-- 行レベルセキュリティ（RLS）の有効化
alter table books enable row level security;
-- 全ユーザー（未ログイン含む）に全操作（読み取り・追加・更新・削除）を許可する
create policy "demo_all" on books for all using (true) with check (true);
