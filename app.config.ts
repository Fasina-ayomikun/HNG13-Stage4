// app.config.ts
import "dotenv/config";

export default {
  expo: {
    name: "stage4-framez",
    slug: "stage4-framez",
    scheme: "stage4-framez", // for future deep links

    owner: "ayodeeyah",
    orientation: "portrait",

    ios: { supportsTablet: false, bundleIdentifier: "com.yourname.framez" },
    android: {
      package: "com.yourname.framez",
      permissions: ["android.permission.READ_MEDIA_IMAGES"],
    },
    web: { bundler: "metro" },
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: process.env.PROJECT_ID,
      },
    },
  },
};
