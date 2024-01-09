import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileButton from "../components/ProfileButton";
import Stories from "../app/Stories";
import UserProfile from "../app/UserProfile";
import FullStory from "../app/FullStory";

type StoriesStackParams = {
  Stories: any;
  FullStory: { story_id: number, storyVotes: number | null, setStoryVotes: any };
  UserProfile: { user_id: any };
};

const StoriesStack = createNativeStackNavigator<StoriesStackParams>();

function StoriesScreenStack() {
    return (
      <StoriesStack.Navigator
      screenOptions={{
        headerRight: () => (
          <ProfileButton session={session?.access_token} />
        ),
      }}>
        <StoriesStack.Screen 
          name="Stories" 
          component={Stories} />
        <StoriesStack.Screen
          name="FullStory"
          component={FullStory}
          options={{ title: "Full Story" }}
        />
        <StoriesStack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ title: "Profile" }}
        />
      </StoriesStack.Navigator>
    );
  };

  export {StoriesScreenStack, StoriesStackParams}