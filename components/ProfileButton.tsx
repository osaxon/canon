import React from 'react'
import { Button, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/core";
import { supabase } from "../lib/supabase";
import { ProfileStackParams } from '../screens/ProfileScreens';


export default function ProfileButton(props: any) {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParams>>();
  const signout = async () => {
    await supabase.auth.signOut();
  };
   if(!props.session){
    return (
        <>
          <Button title="Sign-In" onPress={() => navigation.navigate("Profile", {user_id: -1})} />
        </>
      );
   } 
   return (
    <>
      <Button title="Sign-Out" onPress={signout} />
    </>
  );
  
}
