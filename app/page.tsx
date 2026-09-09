import { supabase } from "@/lib/supabase";

// 登録・編集・削除で一覧が変わるため、毎回DBを取得させる
// 無いと「登録したのに反映されない」状態になる
export const dynamic = "force-dynamic";

export default async function Home() {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: true });

  // 「本当の取得失敗」と「正常に0件」を区別するため先に弾く
  if (error) throw new Error(error.message);

  // 実行時には常に配列が入るが、Supabase-jsの型定義がT[] | nullのため、
  // 型チェック対策で付けている
  const books = data ?? [];

  return (
    <main>
      <h1>読書記録</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </main>
  );
}
