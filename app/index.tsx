import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Index() {
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/(tabs)/feed");
      } else {
        router.replace("/(auth)/login");
      }
    })();
  }, []);
  return <View />;
}
