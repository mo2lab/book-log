import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteBook } from "../actions";

// 一覧と同じ理由（登録・編集・削除の反映のため）で毎回DB取得させる
export const dynamic = "force-dynamic";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  // 存在しないIDでアクセスされた場合、ここで404ページに飛ばす
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-2xl p-6 w-full">
      <Link href="/" className="text-gray-500 hover:underline text-sm">
        ← 一覧に戻る
      </Link>

      <h1 className="text-2xl font-bold mt-4 wrap-break-word">{book.title}</h1>
      <p className="text-gray-500 mt-1 wrap-break-word">
        {book.author || "著者不明"} ・ {book.status}
        {book.rating ? ` ・ ★${book.rating}` : ""}
      </p>

      <p className="mt-6 whitespace-pre-wrap wrap-break-word">
        {book.memo || "感想はまだ書かれていません。"}
      </p>

      <div className="mt-8 flex gap-2">
        {/* Base UIのButtonはLinkとの併用が非推奨のため、buttonVariants()のクラスを<Link>に直接当てている。
            cn()でラップしないと、baseのborder-transparentがoutlineのborder-borderを打ち消し、
            枠線が消えてGhostのような見た目になる */}
        <Link
          href={`/books/${book.id}/edit`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          編集する
        </Link>

        <form action={deleteBook}>
          {/* Server Actionはform actionに直接渡しているためFormDataしか受け取れない。
              idを渡すには関数の引数ではなくこの隠しフィールド経由にする必要がある */}
          <input type="hidden" name="id" value={book.id} />
          {/* 確認ダイアログは未実装。付けるにはクライアントコンポーネント化が必要になり、
              スコープを広げないという方針のため今回は見送っている */}
          <Button type="submit" variant="destructive">
            削除する
          </Button>
        </form>
      </div>
    </main>
  );
}
