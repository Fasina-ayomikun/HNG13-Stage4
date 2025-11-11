import TabBarSpacer from "@/components/TabBarSpacer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useStore } from "../../lib/store";
import { supabase } from "../../lib/supabase";
import { palette } from "../../lib/theme";

dayjs.extend(relativeTime);

export default function Profile() {
  const { user } = useStore();
  const [me, setMe] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setMe(prof);

    const { data: myPosts } = await supabase
      .from("posts")
      .select("*")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });
    setPosts(
      (myPosts ?? []).map((p) => ({
        ...p,
        author_name: prof?.full_name ?? "You",
        author_avatar: prof?.avatar_url ?? null,
        timeAgo: dayjs(p.created_at).fromNow(),
      }))
    );
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const logout = async () => {
    await supabase.auth.signOut();
    Alert.alert("Signed out", "You’ve been logged out successfully.");
  };

  const light = {
    bg: "#f9fafb",
    card: "#ffffff",
    border: "#e5e7eb",
    ink: "#0f172a",
    sub: "#6b7280",
    purple: palette.purple,
    faintPurple: "#eef2ff",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: light.bg }}>
      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 40,
          backgroundColor: light.bg,
        }}
        ListFooterComponent={<TabBarSpacer />} // 👈 add this
        ListHeaderComponent={
          <>
            <View
              style={{
                backgroundColor: light.card,
                borderWidth: 1,
                borderColor: light.border,
                borderRadius: 20,
                padding: 20,
                marginVertical: 16,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 3,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Image
                source={{
                  uri: me?.avatar_url ?? "https://i.pravatar.cc/150?img=3",
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: light.purple,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: light.ink,
                    fontWeight: "800",
                    fontSize: 20,
                  }}
                >
                  {me?.full_name ?? "New Framer"}
                </Text>
                <Text
                  style={{
                    color: light.sub,
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  {user?.email}
                </Text>
                <Text style={{ color: light.sub, fontSize: 12 }}>
                  {posts.length} posts shared
                </Text>
              </View>

              <Pressable
                onPress={logout}
                style={{
                  backgroundColor: light.faintPurple,
                  borderWidth: 1,
                  borderColor: light.purple,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: light.purple, fontWeight: "700" }}>
                  Logout
                </Text>
              </Pressable>
            </View>

            <Text
              style={{
                color: light.ink,
                fontWeight: "800",
                fontSize: 18,
                marginBottom: 12,
                marginLeft: 4,
              }}
            >
              My Posts
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: light.card,
              borderWidth: 1,
              borderColor: light.border,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 1,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              {item.author_avatar ? (
                <Image
                  source={{ uri: item.author_avatar }}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                />
              ) : (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: light.faintPurple,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: light.purple, fontWeight: "700" }}>
                    {item.author_name?.[0]?.toUpperCase() ?? "Y"}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: light.ink,
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  {item.author_name}
                </Text>
                <Text style={{ color: light.sub, fontSize: 12 }}>
                  {item.timeAgo}
                </Text>
              </View>
            </View>

            {item.content ? (
              <Text
                style={{
                  color: light.ink,
                  marginTop: 12,
                  fontSize: 15,
                  lineHeight: 21,
                }}
              >
                {item.content}
              </Text>
            ) : null}

            {item.image_url && (
              <Image
                source={{ uri: item.image_url }}
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: 12,
                  marginTop: 10,
                }}
                resizeMode='cover'
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
