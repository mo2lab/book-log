import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="mx-auto max-w-2xl p-6 w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">読書記録</h1>
        {/* Base UIのButtonはasChildを持たないため、render propで<Link>に差し替えている。
            nativeButton={false}は、差し替え先がネイティブbuttonではないことをBase UIに伝えるために必須 */}
        <Button render={<Link href="/books/new" />} nativeButton={false}>
          新しく登録する
        </Button>
      </div>

      {books.length === 0 ? (
        <p className="rounded border border-dashed p-10 text-center text-gray-500">まだ一件も登録されていません。</p>
      ) : (
        <ul className="space-y-3">
          {books.map((book) => (
            <li key={book.id}>
              <Link href={`/books/${book.id}`}>
                <Card className="transition hover:bg-gray-50">
                  <CardContent>
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-gray-500 ">
                      {book.author || "著者不明"} ・ {book.status}
                      {book.rating ? ` ・ ★${book.rating}` : ""}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
