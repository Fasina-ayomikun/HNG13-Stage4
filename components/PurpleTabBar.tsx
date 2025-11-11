// components/PurpleTabBar.tsx
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette } from "../lib/theme";

export const TABBAR_HEIGHT = 56; // smaller base height

export default function PurpleTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 6); // slightly reduced padding

  return (
    <View
      pointerEvents='box-none'
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 12,
        paddingBottom: bottomPad,
      }}
    >
      <View
        style={{
          borderRadius: 22,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <BlurView
          intensity={35}
          tint={Platform.OS === "ios" ? "light" : "default"}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "rgba(255,255,255,0.85)",
            borderRadius: 22,
            borderWidth: 1,
            borderColor: "rgba(147, 51, 234, 0.15)",
            paddingVertical: 6,
            paddingHorizontal: 4,
          }}
        >
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const onPress = () => navigation.navigate(route.name);

            // Icon mapping
            const iconName =
              route.name === "feed"
                ? "home"
                : route.name === "create"
                ? "plus"
                : "user";

            const isCenter = route.name === "create";

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: isCenter ? 60 : 46,
                  height: isCenter ? 44 : 38,
                  borderRadius: isCenter ? 22 : 18,
                  backgroundColor: isCenter ? palette.purple : "transparent",
                }}
              >
                <Feather
                  name={iconName as any}
                  size={isCenter ? 22 : 20}
                  color={
                    isCenter ? "#fff" : isFocused ? palette.purple : "#6b7280"
                  }
                />
              </Pressable>
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}
