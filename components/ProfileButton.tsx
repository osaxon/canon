import { Button, View } from "react-native";
import { StackParams } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/core";

export default function ProfileButton() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  return (
    <>
      <Button title="Profile" onPress={() => navigation.navigate("Profile", { user_id: 1 })} />
    </>
  );
}
