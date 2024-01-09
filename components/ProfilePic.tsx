import { Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
interface ProfilePicProps {
  userId: any;
}
const ProfilePic: React.FC<ProfilePicProps> = ({ userId }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean | false>(false);
  const [username, setUsername] = useState<string | null>(null);
  // const userId = session?.user?.id || "";
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
          .select("avatar_url, username")
          .eq("id", userId)
          .single();
        if (error) {
          console.error("Error fetching avatar URL:", error);
        } else if (data && data.avatar_url) {
        }
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    }
    fetchAvatarUrl();
  }, [session]);
  const defaultProfile = avatarUrl;
  const defaultImage = require("../assets/user.png");
  const filePath = `${session?.user.user_metadata.user_name}_avatars/${
    session?.user.user_metadata.user_name
  }_${new Date().getTime()}.jpg`;

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
        setAvatarUrl(avatarUrl);
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
        console.log("Avatar URL updated successfully: ");
      }
    } else {
      console.error("Unable to get the public URL");
    }
  }

  useEffect(() => {
    const ownProfile = userId === session?.user.id;
    setIsOwnProfile(ownProfile);
  }, [userId, session?.user.id]);

  return (
    <>
      <Text style={styles.text}>{username}</Text>
      <Image
        style={styles.profile}
        source={avatarUrl ? { uri: avatarUrl } : defaultProfile || defaultImage}
      />
      {isOwnProfile ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => pickImage("avatars", filePath)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default ProfilePic;

const styles = StyleSheet.create({
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
  text: {
    fontWeight: "bold",
  },
});
