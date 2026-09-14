import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createBook } from "../actions";

export default function NewBookPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 w-full">
      <h1 className="mb-6 text-2xl font-bold">新しく登録する</h1>

      <form action={createBook} className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル（必須）</Label>
          <Input id="title" name="title" required />
        </div>

        <div>
          <Label htmlFor="author">著者</Label>
          <Input id="author" name="author" />
        </div>

        <div>
          <Label htmlFor="status">読書状況</Label>
          {/* shadcn/uiのSelectはクライアントコンポーネントのため、
              Server Actionを使うこのformでは扱いが複雑になる。ネイティブのselectで代替している */}
          <select
            id="status"
            name="status"
            defaultValue="未読"
            className="h-9 w-full rounded-md border px-3 text-sm"
          >
            <option>未読</option>
            <option>読書中</option>
            <option>読了</option>
          </select>
        </div>

        <div>
          <Label htmlFor="rating">評価（1〜5）</Label>
          <Input type="number" id="rating" name="rating" min="1" max="5" />
        </div>

        <div>
          <Label htmlFor="memo">感想メモ</Label>
          {/* rows={5} は shadcn/ui 側のデフォルトクラスに打ち消されて効かないため、
              className で高さを直接指定している */}
          <Textarea id="memo" name="memo" className="h-32" />
        </div>

        <div className="flex gap-2">
          <Button type="submit">登録する</Button>
          {/* [id]/page.tsx と同じ理由：Base UIのButtonはLinkとの併用が非推奨のため、
              buttonVariants()のクラスを<Link>に直接当てている */}
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            やめる
          </Link>
        </div>
      </form>
    </main>
  );
}
