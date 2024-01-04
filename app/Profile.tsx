import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
} from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";
import { decode } from 'base64-arraybuffer'

export default function Profile() {
  async function pickImage(bucketName: string, filePath: string) {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const firstAsset = result.assets[0];
          if (firstAsset.uri) {
            try {
              const base64 = await FileSystem.readAsStringAsync(
                firstAsset.uri,
                {
                  encoding: FileSystem.EncodingType.Base64,
                }
              );

              const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, decode(`${base64}`), {
                  contentType: 'image/jpeg'
                });

              if (error) {
                alert("Error uploading file: " + error.message); 
                return;
              }

              alert("File uploaded successfully" + JSON.stringify(data));
            } catch (error) {
              console.error("Error processing the file: ", error);
            }
          } else {
            console.log("URI is undefined");
            return;
          }
        }
      } else {
        console.log("Image picking was cancelled");
      }
    } catch (error) {
      console.error("Error during image picking or uploading: ", error);
    }
  }

  return (
    <>
      <Image style={styles.profile} source={require("../assets/dalle1.png")} />
      <Button
        onPress={() => pickImage("avatars", `user_avatars/user123.jpg`)}
        title="edit"
      />
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
