import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, createTheme } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import FullStory from "./app/FullStory";
import Profile from "./app/Profile";
import SignIn from "./app/SignIn";
import Stories from "./app/Stories";
import StoryAdd from "./components/StoryAdd";
import StoryComments from "./components/StoryComments";
import StoryConfirm from "./components/StoryConfirm";
import UserProfile from "./app/UserProfile";
import GenerateImage from "./components/GenerateImage";
import ProfileButton from "./components/ProfileButton";
import { supabase } from "./lib/supabase";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Votes from "./components/Votes";

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
  FullStory: {
    story_id: number;
    votes: number | null;
  };
  StoryComments: { story_id: number };
  CreateNew: undefined; // TODO may need to add story_id as a param to make route re-usable for adding to existing story
  ProfileStack: ProfileStackParams;
  CreateNewStack: CreateNewStackParams;
};

const Stack = createBottomTabNavigator<StackParams>();
export const queryClient = new QueryClient();

export type StoriesStackParams = {
  
  Stories: any;
  StoryAdd: { story_id: number };
  StoryConfirm: { story_id: number };
  FullStory: {
    story_id: number;
    votes: number | null;
  };
  StoryComments: { story_id: number };
};

export type ProfileStackParams = {
  Profile: { user_id: any };
  UserProfile: { user_id: any };
  FullStory: {
    story_id: number;
    votes: number;
  };
};

export type CreateNewStackParams = {
  CreateNew: undefined;
};

const StoriesStack = createNativeStackNavigator<StoriesStackParams>();
const ProfileStack = createNativeStackNavigator<ProfileStackParams>();
const CreateNewStack = createNativeStackNavigator<CreateNewStackParams>();

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

  const StoriesScreenStack = () => {
    return (
      <StoriesStack.Navigator
      screenOptions={{
        headerRight: () => (
          <ProfileButton session={session?.access_token} />
        ),
      }}>
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
      </StoriesStack.Navigator>
    );
  };

  const ProfileScreenStack = () => {
    return(
    <ProfileStack.Navigator
    screenOptions={{
      headerRight: () => (
        <ProfileButton session={session?.access_token} />
      ),
    }}>
      <ProfileStack.Screen
        name="Profile"
        component={session?.access_token ? Profile : SignIn}
        options={{
          title: "Profile",
        }}
      />
      <ProfileStack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ title: "Profile" }}
        />
        <StoriesStack.Screen
          name="FullStory"
          component={FullStory}
          options={{ title: "Full Story" }}
        />
    </ProfileStack.Navigator>)
  };
  
  const CreateNewScreenStack = () => {
    return(
    <CreateNewStack.Navigator
    screenOptions={{
      headerRight: () => (
        <ProfileButton session={session?.access_token} />
      ),
    }}>
      <CreateNewStack.Screen
        name="CreateNew"
        component={GenerateImage}
        options={{
          title: "New Story",
        }}
      />
    </CreateNewStack.Navigator>)
  };

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
              name="StoriesStack"
              component={StoriesScreenStack}
              options={{
                title: "Stories",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="home" color={color} size={size} />
                ),
              }}
            />
            <Stack.Screen
              name="ProfileStack"
              component={ProfileScreenStack}
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="person" color={color} size={size} />
                ),
              }}
            />
            <Stack.Screen
              name="CreateNewStack"
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
