import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";
import Constants from "expo-constants";

// Fixes bug with Expo where env variables aren't available on web version
// Loads env variables from new app.config.ts file if not available from process.env first
const supabaseUrl =
    process.env.EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_URL! ||
    Constants.expoConfig?.extra?.env.EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_URL;
const supabaseAnonKey =
    process.env.EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_ANON_KEY! ||
    Constants.expoConfig?.extra?.env
        .EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});
