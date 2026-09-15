import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { updateBook } from "../../actions";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

// Supabaseクライアントの内部fetchがNext.jsの静的判定に正しく拾われる保証がないため、
// ビルド時に1回だけレンダリングされて更新が反映されなくなるのを避けるために明示している
export const dynamic = "force-dynamic";

export default async function EditBookPage({
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
      <h1 className="mb-6 text-2xl font-bold">編集する</h1>

      <form action={updateBook} className="space-y-4">
        {/* Server Actionはform actionに直接渡しているためFormDataしか受け取れない。
            idを渡すには関数の引数ではなくこの隠しフィールド経由にする必要がある */}
        <input type="hidden" name="id" value={book.id} />
        <div>
          <Label htmlFor="title">タイトル（必須）</Label>
          <Input id="title" name="title" required defaultValue={book.title} />
        </div>

        <div>
          <Label htmlFor="author">著者</Label>
          <Input id="author" name="author" defaultValue={book.author ?? ""} />
        </div>

        <div>
          <Label htmlFor="status">読書状況</Label>
          <select
            id="status"
            name="status"
            defaultValue={book.status}
            className="h-9 w-full rounded-md border px-3 text-sm"
          >
            <option>未読</option>
            <option>読書中</option>
            <option>読了</option>
          </select>
        </div>

        <div>
          <Label htmlFor="rating">評価（1〜5）</Label>
          <Input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            defaultValue={book.rating ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="memo">感想メモ</Label>
          <Textarea
            id="memo"
            name="memo"
            className="h-32"
            defaultValue={book.memo ?? ""}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">保存する</Button>
          {/* [id]/page.tsx と同じ理由：Base UIのButtonはLinkとの併用が非推奨のため、
              buttonVariants()のクラスを<Link>に直接当てている */}
          <Link
            href={`/books/${book.id}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            やめる
          </Link>
        </div>
      </form>
    </main>
  );
}
