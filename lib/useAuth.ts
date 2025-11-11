import { useEffect } from "react";
import { useStore } from "./store";
import { supabase } from "./supabase";

export const useAuth = () => {
  const { session, setSession } = useStore();
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);
  return { session, user: useStore.getState().user };
};
