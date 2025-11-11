import { Redirect, Tabs } from "expo-router";
import PurpleTabBar from "../../components/PurpleTabBar";
import { useStore } from "../../lib/store";

export default function TabsLayout() {
  const { session } = useStore();
  if (!session) return <Redirect href='/(auth)/login' />;
  return (
    <Tabs
      tabBar={(p) => <PurpleTabBar {...p} />}
      screenOptions={{ headerShown: false }}
    />
  );
}
