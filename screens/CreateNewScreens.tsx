import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GenerateImage from "../components/GenerateImage";
import ProfileButton from "../components/ProfileButton";

type CreateNewStackParams = {
  CreateNew: undefined; // TODO may need to add story_id as a param to make route re-usable for adding to existing story
};

const CreateNewStack = createNativeStackNavigator<CreateNewStackParams>();

function CreateNewScreenStack() {
  const session = useContext(SessionContext)
  return (
    <CreateNewStack.Navigator
      screenOptions={{
        headerRight: () => <ProfileButton session={session?.access_token} />,
      }}
    >
      <CreateNewStack.Screen
        name="CreateNew"
        component={GenerateImage}
        options={{
          title: "New Story",
        }}
      />
    </CreateNewStack.Navigator>
  );
}

export { CreateNewScreenStack, CreateNewStackParams };
