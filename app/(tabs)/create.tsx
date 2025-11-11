import TabBarSpacer from "@/components/TabBarSpacer";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useStore } from "../../lib/store";
import { supabase } from "../../lib/supabase";
import { palette } from "../../lib/theme";

export default function Create() {
  const [content, setContent] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const { user } = useStore();

  const pick = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!r.canceled) setImg(r.assets[0].uri);
  };

  const uploadImage = async (uri: string) => {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) throw new Error("Please log in first.");

    console.log("uploading");

    const response = await fetch(uri);
    const blob = await response.blob();

    const filePath = `post_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}.jpg`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const { data: pub } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    console.log("✅ Uploaded:", pub.publicUrl);
    return pub.publicUrl;
  };

  const submit = async () => {
    if (!user) return console.log("no user");
    try {
      let image_url: string | undefined;
      if (img) image_url = await uploadImage(img);

      const { error } = await supabase.from("posts").insert({
        author_id: user.id,
        content,
        image_url,
      });
      if (error) throw error;

      setContent("");
      setImg(null);
      Alert.alert("Posted!", "Your frame is live.");
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Failed to post");
    }
  };

  // 💡 Updated light theme
  const light = {
    bg: "#f9fafb",
    card: "#ffffff",
    border: "#e5e7eb",
    ink: "#0f172a",
    sub: "#6b7280",
    purple: palette.purple,
    faintPurple: "#eef2ff",
    teal: "#10b981",
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor: light.bg }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps='handled'
      >
        <View
          style={{
            width: "100%",
            backgroundColor: light.card,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: light.border,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: light.ink,
              marginBottom: 8,
            }}
          >
            Create a new post
          </Text>
          <Text style={{ color: light.sub, marginBottom: 16 }}>
            Share your latest thought, picture, or experience.
          </Text>

          <TextInput
            placeholder="What's on your mind?"
            placeholderTextColor={light.sub}
            multiline
            value={content}
            onChangeText={setContent}
            style={{
              minHeight: 120,
              color: light.ink,
              backgroundColor: "#fff",
              borderColor: light.border,
              borderWidth: 1,
              borderRadius: 14,
              padding: 14,
              textAlignVertical: "top",
              fontSize: 15,
              marginBottom: 14,
            }}
          />

          {img && (
            <View style={{ marginBottom: 14 }}>
              <Image
                source={{ uri: img }}
                style={{
                  width: "100%",
                  height: 240,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: light.border,
                }}
                resizeMode='cover'
              />
            </View>
          )}

          <Pressable
            onPress={pick}
            style={{
              backgroundColor: light.faintPurple,
              borderColor: light.purple,
              borderWidth: 1,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: light.purple, fontWeight: "700" }}>
              + Add Image
            </Text>
          </Pressable>

          <Pressable
            onPress={submit}
            disabled={!content && !img}
            style={{
              backgroundColor: light.purple,
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: "center",
              opacity: !content && !img ? 0.6 : 1,
              shadowColor: light.purple,
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
              Post
            </Text>
          </Pressable>
        </View>
        <TabBarSpacer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
