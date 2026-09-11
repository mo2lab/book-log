import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

      <h1 className="text-2xl font-bold mt-4">{book.title}</h1>
      <p className="text-gray-500 mt-1">
        {book.author || "著者不明"} ・ {book.status}
        {book.rating ? ` ・ ★${book.rating}` : ""}
      </p>

      <p className="mt-6 whitespace-pre-wrap">
        {book.memo || "感想はまだ書かれていません。"}
      </p>

      <div className="mt-8">
        {/* Base UIのButtonはLinkとの併用が非推奨のため、buttonVariants()のクラスを<Link>に直接当てている。
            cn()でラップしないと、baseのborder-transparentがoutlineのborder-borderを打ち消し、
            枠線が消えてGhostのような見た目になる */}
        <Link
          href={`/books/${book.id}/edit`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          編集する
        </Link>
      </div>
    </main>
  );
}
