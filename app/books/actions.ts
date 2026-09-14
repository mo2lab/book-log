"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// rating以外は trim() のみで空文字のまま保存され、ratingだけ明示的に null 変換している。
// 表示側は `book.author || '著者不明'` のように || で判定しているため、
// null と空文字のどちらでも表示結果は変わらない。あえて型を揃えていない。
function readForm(formData: FormData) {
  const rating = String(formData.get("rating") ?? "");
  return {
    title: String(formData.get("title") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    status: String(formData.get("status") ?? "未読"),
    rating: rating ? Number(rating) : null,
    memo: String(formData.get("memo") ?? "").trim(),
  };
}

export async function createBook(formData: FormData) {
  const book = readForm(formData);
  const { error } = await supabase.from("books").insert(book).select();
  if (error) throw new Error(error.message);

  // 一覧は dynamic='force-dynamic' だが、登録直後にキャッシュが効いて
  // 反映されない場合があるため、明示的にキャッシュを無効化している
  revalidatePath("/");
  redirect("/");
}
