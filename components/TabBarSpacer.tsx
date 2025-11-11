// components/TabBarSpacer.tsx
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TABBAR_HEIGHT } from "./PurpleTabBar";

export default function TabBarSpacer() {
  const insets = useSafeAreaInsets();
  // Same vertical space as the bar + safe inset + a little breathing room
  return (
    <View style={{ height: TABBAR_HEIGHT + Math.max(insets.bottom, 8) + 24 }} />
  );
}
