// lib/profile.ts
import { supabase } from "./supabase";

export async function ensureProfile(fullName?: string) {
  const { data: sess } = await supabase.auth.getSession();
  const user = sess.session?.user;
  if (!user) return; // not logged in ⇒ can't pass RLS

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName ?? user.user_metadata?.full_name ?? null,
  });
}
