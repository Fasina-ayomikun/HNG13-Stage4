import TabBarSpacer from "@/components/TabBarSpacer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { palette } from "../../lib/theme";

dayjs.extend(relativeTime);

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  type PostWithProfile = {
    id: string;
    content: string | null;
    image_url: string | null;
    created_at: string;
    profiles: { full_name: string | null; avatar_url: string | null } | null;
  };

  const load = async () => {
    const { data, error } = (await supabase.from("posts").select(
      `id, content, image_url, created_at,
       profiles:author_id(full_name, avatar_url)`
    )) as unknown as { data: PostWithProfile[]; error: any };

    if (!error) {
      setPosts(
        (data ?? []).map((p) => ({
          ...p,
          author_name: p.profiles?.full_name ?? "Anonymous",
          author_avatar: p.profiles?.avatar_url ?? null,
          timeAgo: dayjs(p.created_at).fromNow(),
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload: any) => {
          const p = payload.new;
          setPosts((prev) => [{ ...p }, ...prev]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const light = useMemo(
    () => ({
      bg: "#f9fafb",
      card: "#ffffff",
      border: "#e5e7eb",
      ink: "#0f172a",
      sub: "#6b7280",
      purple: palette.purple,
      faintPurple: "#eef2ff",
    }),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: light.bg }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 14,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderColor: light.border,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: light.ink,
            fontWeight: "900",
            fontSize: 26,
          }}
        >
          Framez
        </Text>
        <Pressable
          onPress={load}
          style={{
            backgroundColor: light.purple,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 10,
            shadowColor: light.purple,
            shadowOpacity: 0.25,
            shadowRadius: 5,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Refresh</Text>
        </Pressable>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{
          padding: 16,
          backgroundColor: light.bg,
          paddingBottom: 40,
        }}
        ListHeaderComponent={
          <Text
            style={{
              color: light.sub,
              textAlign: "center",
              fontSize: 14,
              marginVertical: 8,
            }}
          >
            Discover what people are sharing today
          </Text>
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
                    {item.author_name?.[0]?.toUpperCase() ?? "A"}
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
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            colors={[light.purple]}
            tintColor={light.purple}
          />
        }
        ListFooterComponent={<TabBarSpacer />}
      />
    </SafeAreaView>
  );
}
