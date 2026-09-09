import { createClient } from "@supabase/supabase-js";

// ! で非nullを断言しているのは、.env.local と Vercel の両方に
// 必ず値を登録する運用にしているため。未設定チェックはこのアプリの規模では行わない。
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
