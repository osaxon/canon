import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {StoriesScreenStack} from "./screens/StoriesScreens"
import {ProfileScreenStack} from "./screens/ProfileScreens"
import {CreateNewScreenStack} from "./screens/ProfileScreens"
import { supabase } from "./lib/supabase";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const theme = createTheme({
  mode: "dark",
  components: {
    Button: {
      raised: true,
    },
  },
});

export type StackParams = {
    Home: any;
    SignIn: any;
    Explore: any;
    StoriesStack: StoriesStackParams;
    Profile: { user_id: any };
    UserProfile: { user_id: any };
    StoryAdd: { story_id: number };
    StoryConfirm: { story_id: number };
    FullStory: { story_id: number, storyVotes: number | null, setStoryVotes: any };
    StoryComments: { story_id: number };
    CreateNew: undefined; // TODO may need to add story_id as a param to make route re-usable for adding to existing story
};

const Stack = createBottomTabNavigator<StackParams>();
const queryClient = new QueryClient();

export type StoriesStackParams = {
    Stories: any;
    StoryAdd: { story_id: number };
    StoryConfirm: { story_id: number };
    FullStory: { story_id: number, storyVotes: number | null, setStoryVotes: any };
    StoryComments: { story_id: number };
    UserProfile: { user_id: any };
};
const StoriesStack = createNativeStackNavigator<StoriesStackParams>();
const StoriesScreenStack = () => {
    return (
        <StoriesStack.Navigator>
            <StoriesStack.Screen name="Stories" component={Stories} />
            <StoriesStack.Screen
                name="StoryAdd"
                component={StoryAdd}
                options={{ title: "Add" }}
            />
            <StoriesStack.Screen
                name="StoryConfirm"
                component={StoryConfirm}
                options={{ title: "Confirm" }}
            />
            <StoriesStack.Screen
                name="FullStory"
                component={FullStory}
                options={{ title: "Full Story" }}
            />
            <StoriesStack.Screen
                name="StoryComments"
                component={StoryComments}
                options={{ title: "Comments" }}
            />
            <StoriesStack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ title: "Profile" }}
            />
        </StoriesStack.Navigator>
    );
};

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Explore"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="Explore"
              component={StoriesScreenStack}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="home" color={color} size={size} />
                ),
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreenStack}
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="person" color={color} size={size} />
                ),
              }}
            />
            <Stack.Screen
              name="CreateNew"
              component={CreateNewScreenStack}
              options={{
                title: "New Story",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="add" color={color} size={size} />
                ),
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
