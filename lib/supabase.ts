import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_URL!;
const supabaseAnonKey =
    process.env.EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_ANON_KEY!;

console.log(process.env, "<--- process env");

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
