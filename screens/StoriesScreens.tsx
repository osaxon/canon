import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileButton from "../components/ProfileButton";
import Stories from "../app/Stories";
import StoryAdd from "../components/StoryAdd";
import StoryComments from "../components/StoryComments";
import StoryConfirm from "../components/StoryConfirm";
import UserProfile from "../app/UserProfile";
import FullStory from "../app/FullStory";

export type StoriesStackParams = {
    Stories: any;
    StoryAdd: { story_id: number };
    StoryConfirm: { story_id: number };
    FullStory: { story_id: number };
    StoryComments: { story_id: number };
    UserProfile: { user_id: any };
  };

const StoriesStack = createNativeStackNavigator<StoriesStackParams>();

function StoriesScreenStack() {
    return (
      <StoriesStack.Navigator
      screenOptions={{
        headerShown: false,
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
        <StoriesStack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ title: "Profile" }}
        />
      </StoriesStack.Navigator>
    );
  };