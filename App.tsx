import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Session } from "@supabase/supabase-js";
import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Profile from "./app/Profile";
import { supabase } from "./lib/supabase";

import HomePage from "./app/HomePage";
import SignIn from "./app/SignIn";

export type RootStackParams = {
  Home: any;
  SignIn: any;
  Stories: any;
  Profile: any;
};

const Stack = createNativeStackNavigator<RootStackParams>();

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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// <View style={styles.container}>
//     <HomePage />
//     <EmailForm />
//     <Auth />
//     <Text>{session?.user.id}</Text>
// </View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
