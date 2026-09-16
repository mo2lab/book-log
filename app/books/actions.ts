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
  const { error } = await supabase.from("books").insert(book);
  if (error) throw new Error(error.message);

  // 各ページがforce-dynamicのため実質的な役目はほぼないが、
  // ブラウザの「戻る」操作でキャッシュされた一覧が一瞬古いまま表示されるのを防ぐために残している。
  revalidatePath("/");
  redirect("/");
}

export async function updateBook(formData: FormData) {
  // Server Actionはform actionに直接渡しているためFormDataしか受け取れない。
  // idは関数の引数ではなく、edit画面のhiddenフィールド経由でここに渡ってくる。
  const id = String(formData.get("id"));
  const book = readForm(formData);
  const { error } = await supabase.from("books").update(book).eq("id", id);
  if (error) throw new Error(error.message);

  // createBookと同じ理由（force-dynamic下ではほぼ保険）。
  // 一覧・詳細の両方が編集の影響を受けるため両方に対して呼んでいる。
  revalidatePath("/");
  revalidatePath(`/books/${id}`);
  redirect(`/books/${id}`);
}

export async function deleteBook(formData: FormData) {
  const id = String(formData.get("id"));
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // createBookと同じ理由（force-dynamic下ではほぼ保険）。
  // 一覧が消去の影響を受けるため呼んでいる。
  revalidatePath("/");
  // 詳細ページ（/books/[id]）は削除後リダイレクトするため呼ばない。
  // revalidatePathを呼ばなくても、削除された本のURLに直接アクセスすればnotFound()で404になる。
  redirect("/");
}
