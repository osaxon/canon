import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileButton from "../components/ProfileButton";
import Profile from "../app/Profile";
import SignIn from "../app/SignIn";

type ProfileStackParams = {
    Profile: { user_id: any };
  };

const ProfileStack = createNativeStackNavigator<ProfileStackParams>();

function ProfileScreenStack(){
    return (
      <ProfileStack.Navigator
      screenOptions={{
        headerRight: () => (
          <ProfileButton session={session?.access_token} />
        ),
      }}
      >
        <ProfileStack.Screen
          name="Profile"
          component={session?.access_token ? Profile : SignIn}
          options={{
            title: "Profile",
          }}
        />
      </ProfileStack.Navigator>
    );
  };

  export {ProfileScreenStack, ProfileStackParams}

