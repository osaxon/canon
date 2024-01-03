import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { launchImageLibrary } from "react-native-image-picker";

export default function Profile() {
//   const supabase = createClient(
//     "https://ykmnivylzhcxvtsjznhb.supabase.co",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbW5pdnlsemhjeHZ0c2p6bmhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMzE3MjY5NiwiZXhwIjoyMDE4NzQ4Njk2fQ.yV_BM32bQkLTAZYfV2yX_J2aToUYS4jbTHihHSN-S-U"
//   );

  const pickImage = () => {

    let options = {
        storageOptions: {
            path: "image"
        }
    }
    launchImageLibrary(options, response => console.log(response));

    }

  return (
    <>
     <Image style={styles.profile} source={require('../assets/dalle1.png')} />
      <Button onPress={() => pickImage()} title="edit image" />
      <View>
        <Text>Points</Text>
        <Text>12</Text>
      </View>
      <View>
        <Text>Following</Text>
        <Text>5</Text>
      </View>
      <View>
        <Text>UserName</Text>
        <Text>Story Additions</Text>
        <Text>Story Creations</Text>
      </View>
      <Button title="Follow" />
      <View></View>
      <View>
        <Text>Latest Stories</Text>
        <ScrollView>
          <Image
            style={styles.stories}
            source={require("../assets/icon.png")}
          />
          <Image
            style={styles.stories}
            source={require("../assets/icon.png")}
          />
          <Image
            style={styles.stories}
            source={require("../assets/icon.png")}
          />
          <Image
            style={styles.stories}
            source={require("../assets/icon.png")}
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  stories: {
    width: 150,
    height: 200,
  },
});
