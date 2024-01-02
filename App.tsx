import HomePage from "./app/HomePage";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as React from 'react'
import Auth from "./app/Auth";
import EmailForm from "./app/EmailForm";
import { supabase } from "./lib/supabase";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import About from "./app/about";

export type RootStackParams = {
    Home: any;
    SignIn: any;
    About: any;
}

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
                <Stack.Screen name="SignIn" component={EmailForm} />
                <Stack.Screen name="About" component={About} />
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
