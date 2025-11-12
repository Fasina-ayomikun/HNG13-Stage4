import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { palette } from "../lib/theme";
import { useAuth } from "../lib/useAuth";

export default function RootLayout() {
  useAuth();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.bg }}>
      <StatusBar barStyle='light-content' />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.bg },
        }}
      />
    </GestureHandlerRootView>
  );
}
