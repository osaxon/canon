import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Auth from "./components/Auth";
import EmailForm from "./components/EmailForm";
import { supabase } from "./lib/supabase";
import Stories from "./components/Stories";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  console.log(session, "<--- session");

  return (
    <View style={styles.container}>
      <EmailForm />
      <Auth />
      <Text>{session?.user.id}</Text>
      <Stories />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
