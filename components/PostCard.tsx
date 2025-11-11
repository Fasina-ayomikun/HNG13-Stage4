import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Image, StyleSheet, Text, View } from "react-native";
import { angled, palette, shadow } from "../lib/theme";

dayjs.extend(relativeTime);
export default function PostCard({ post }: { post: any }) {
  return (
    <View style={[styles.card, angled.card, shadow.card]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <Image
          source={{ uri: post.author_avatar ?? "https://i.pravatar.cc/100" }}
          style={[styles.avatar]}
        />
        <View>
          <Text style={{ color: palette.text, fontWeight: "800" }}>
            {post.author_name ?? "Anon"}
          </Text>
          <Text style={{ color: palette.sub, fontSize: 12 }}>
            {dayjs(post.created_at).fromNow()}
          </Text>
        </View>
      </View>
      {post.image_url ? (
        <Image
          source={{ uri: post.image_url }}
          style={{ height: 220, borderRadius: 18, marginBottom: 10 }}
          resizeMode='cover'
        />
      ) : null}
      {post.content ? (
        <Text style={{ color: palette.text, lineHeight: 20 }}>
          {post.content}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    marginHorizontal: 14,
    marginVertical: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.purple,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    transform: [{ rotate: "12deg" }],
    borderWidth: 2,
    borderColor: palette.purple,
  },
});
