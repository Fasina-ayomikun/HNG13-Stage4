import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type S = {
  session: Session | null;
  user: User | null;
  setSession: (s: Session | null) => void;
};
export const useStore = create<S>((set) => ({
  session: null,
  user: null,
  setSession: (session) => set({ session, user: session?.user ?? null }),
}));
