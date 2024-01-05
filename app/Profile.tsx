import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";
import { decode } from "base64-arraybuffer";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  // const [images, setImages] = useState<object | null>([]);
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean | false>(false);

  const userId = session?.user?.id || "";
  console.log([userId])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    async function fetchAvatarUrl() {
      if (userId) {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching avatar URL:", error);
        } else if (data && data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      }
    }
    fetchAvatarUrl();
  }, [session]);

  const defaultProfile = avatarUrl;
  const filePath = `${session?.user.user_metadata.user_name}_avatars/${
    session?.user.user_metadata.user_name
  }_${new Date().getTime()}.jpg`;

  // async function getStory() {
  //   try {
  //     const { data, error } = await supabase.storage
  //       .from("DALLEImages")
  //       .list("", {
  //         limit: 100,
  //         offset: 0,
  //         sortBy: { column: "created_at", order: "asc" },
  //       });

  //     if (error) {
  //       console.error("Error getting story: ", error);
  //     } else if (data) {
  //       setImages(data);
  //       console.log(data);
  //     }
  //   } catch (error) {
  //     console.error("Error getting story: ", error);
  //   }
  // }

  // useEffect(() => {
  //   getStory();
  // }, []);

  const fauxImages = [
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
  ];

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
                  contentType: "image/jpeg",
                  upsert: true,
                });

              if (error) {
                alert("Error uploading file: " + error.message);
                return;
              }

              alert("File uploaded successfully");
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

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    if (data) {
      const uploadedImageUrl = data.publicUrl;
      setAvatarUrl(uploadedImageUrl);

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: uploadedImageUrl })
        .eq("id", userId);

      if (error) {
        console.error("Error updating profile: ", error);
      } else {
        setAvatarUrl(uploadedImageUrl);
        console.log(
          "Avatar URL updated successfully: ",
          avatarUrl,
          uploadedImageUrl
        );
      }
    } else {
      console.error("Unable to get the public URL");
    }
  }

  async function fetchFollowCount() {

    if (!userId) {
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("follower_count")
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error("Error fetching follower count: ", fetchError);
        return;
      } else if (data) {
        setFollowerCount(data.follower_count);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    fetchFollowCount();
  }, [userId]);

  async function increaseFollowCount() {
    if (!userId) {
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("follower_count")
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error("Error fetching follower count: ", fetchError);
        return;
      }

      const newFollowerCount = (data.follower_count || 0) + 1;
      setFollowerCount(newFollowerCount);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ follower_count: newFollowerCount })
        .eq('id', userId);

      if (updateError) {
        console.error("Error: ", updateError);
      } else {
        console.log("Follower count updated successfully");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async function profileOwnership() {

    if (!userId) {
      return false;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select('*')
        .eq('id', userId);

      if (fetchError) {
        console.error("Error: fetching user id ", fetchError);
        return false;
      }
      return data.length > 0 && userId === data[0].id;
    } catch (error) {
      console.error("Error getting user id: ", error);
      return false;
    }
  }

  useEffect(() => {
    async function checkProfileOwnership() {
      const ownProfile = await profileOwnership();
      setIsOwnProfile(ownProfile);
    }
    checkProfileOwnership();
  }, [userId]);

  return (
    <>
      <View style={styles.container}>
        <Image
          style={styles.profile}
          source={{ uri: avatarUrl || defaultProfile }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => pickImage("avatars", filePath)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <View style={styles.userInfoSection}>
          <Text style={styles.userInfoText}>
            Following: {`${followerCount}`}
          </Text>
          <Text
            style={styles.userInfoText}
          >{`${session?.user.user_metadata.user_name}`}</Text>
          {/* <Text style={styles.userInfoText}>Story Additions</Text>
          <Text style={styles.userInfoText}>Story Creations</Text> */}
        </View>
        {!isOwnProfile ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => increaseFollowCount()}
          >
            <Text style={styles.buttonText}>Follow</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.titleText}>Latest Stories</Text>
        <ScrollView>
          <View style={styles.storyContainer}>
            {fauxImages.map((source, index) => (
              <Image key={index} style={styles.stories} source={source} />
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  profile: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#333",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0095f6",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  userInfoSection: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 18,
    color: "#333",
    margin: 3,
  },
  stories: {
    width: 122,
    height: 122,
    borderRadius: 3,
    borderColor: "#333",
    borderWidth: 1,
    margin: 0,
  },
  scrollView: {
    width: "100%",
    marginTop: 10,
  },
  storyContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#262626",
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 20,
  },
});
