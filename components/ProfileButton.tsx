import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-elements";
import { ProfileStackParams, StackParams } from "../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/core";
import { supabase } from "../lib/supabase";

export default function ProfileButton(props: any) {
  const { theme, updateTheme } = useTheme();
  const styles = StyleSheet.create({
    buttonContainer: {
      padding: 0,
      margin: 0,
    },
  });

  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
  const signout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.buttonContainer}>
      {!props.session ? (
          <Button
            title="Sign-In"
            onPress={() => navigation.navigate("ProfileStack", { screen: "Profile", params: {user_id: -1} })}
          />
      ) : (
          <Button title="Sign-Out" onPress={signout} />
      )}
    </View>
  );
}
