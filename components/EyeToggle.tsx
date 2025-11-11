import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";

type Props = {
  visible: boolean;
  onPress: () => void;
  color?: string;
  size?: number;
};

export const EyeToggle = ({
  visible,
  onPress,
  color = "#aaa",
  size = 20,
}: Props) => (
  <Pressable onPress={onPress} hitSlop={8} style={{ padding: 4 }}>
    <Feather name={visible ? "eye" : "eye-off"} size={size} color={color} />
  </Pressable>
);
