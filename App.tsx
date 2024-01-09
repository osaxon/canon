import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import React,{ useEffect, useState, createContext} from "react";
import { supabase } from "./lib/supabase";
import {StoriesScreenStack, StoriesStackParams} from "./screens/StoriesScreens"
import {ProfileScreenStack, ProfileStackParams} from "./screens/ProfileScreens"
import {CreateNewScreenStack, CreateNewStackParams} from "./screens/CreateNewScreens"
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createClient } from '@supabase/supabase-js';

const theme = createTheme({
  mode: "dark",
  components: {
    Button: {
      raised: true,
    },
  },
});

export type TabParams = {
    StoriesStack: StoriesStackParams;
    ProfileStack: ProfileStackParams;
    CreateNewStack: CreateNewStackParams;
};

const Tab = createBottomTabNavigator<TabParams>();
const queryClient = new QueryClient();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const SessionContext = createContext<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <SessionContext.Provider value={session}>
      <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="StoriesStack"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Tab.Screen
              name="StoriesStack"
              component={StoriesScreenStack}
              options={{
                title: "Stories",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="home" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="ProfileStack"
              component={ProfileScreenStack}
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="person" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="CreateNewStack"
              component={CreateNewScreenStack}
              options={{
                title: "New Story",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="add" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
    </SessionContext.Provider>
    
  );
}


