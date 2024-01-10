import { useFocusEffect } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Button, Card, Image, Text, useTheme } from "react-native-elements";
import { supabase } from "../lib/supabase";
import { ImageData } from "../types/functions";
import { useNewStory } from "../utils/hooks";
import { generateImage, storeImage } from "../utils/supabase";
import ScreenBackground from "./ScreenBackground";

const generateAndStoreImage = async () => {
  const fileName = `generated_images/image-${new Date().valueOf()}.jpg`;
  try {
    const { image, imageContext } = await generateImage();

    if (!image.b64_json) {
      console.log("no base64 data");
      throw new Error("no base 64 data to generate image");
    }

    const storedImageData = await storeImage({
      base64: image.b64_json!,
      fileName: fileName,
      bucketName: "openai",
    });

    if (!storedImageData) {
      throw new Error("error storing the image");
    }

    const { data: publicImgData } = supabase.storage
      .from("openai")
      .getPublicUrl(fileName);

    return {
      ...publicImgData,
      prompt: image.original_prompt,
      imageContext,
    };
  } catch (error) {
    console.log(error, "<--- catch block error");
  }
};

export default function GenerateImage() {
  const { theme, updateTheme } = useTheme();
  const [session, setSession] = useState<Session | null>(null);
  const styles = StyleSheet.create({
    generatorCard: {
      boxSixing: "border-box",
      flex: 1,
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
      minWidth: "auto",
      width: "auto",
      maxWidth: 1080,
      height: "auto",
      maxheight: "100%",
      margin: "auto",
      padding: 10,
      
    },
    imageContainer: {
      maxWidth: "100%",
      maxHeight: "100%",
      margin: 0,
      backgroundColor: theme.colors?.grey4,
      borderStyle:"solid",
      borderLeftWidth:1,
      borderLeftColor:theme.colors?.grey2,
      borderRightWidth:1,
      borderRightColor:theme.colors?.grey2,
    },
    image: {
      maxWidth: "100%",
      maxHeight: "100%",
      aspectRatio: 1,
      margin: 0,
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      backgroundColor: theme.colors?.grey4,
      borderStyle:"solid",
      borderBottomWidth:1,
      borderBottomColor:theme.colors?.grey2,
    },
    text: {
      fontWeight:"bold",
      fontSize:16,
      overflow:"scroll",
      color: theme.colors?.black,
      textAlign: "center",
      maxWidth: 540,
      padding:5,
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems:"center",
      justifyContent: "flex-start",
      marginBottom:50,
      paddingTop:50,
      paddingLeft:20,
      paddingRight:20,
      backgroundColor: theme.colors?.grey4,
      borderStyle:"solid",
      borderTopWidth:1,
      borderTopColor:theme.colors?.grey2,
        }
  });
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const {
    mutate: generate,
    reset,
    data: image,
    status: newImageStatus,
  } = useMutation({
    mutationKey: ["seed-image"],
    mutationFn: generateAndStoreImage,
  });
  // return it as base64 ✅
  // store it in storage bucket ✅
  // update db with url from bucket
  // update the story

  const imageData: ImageData = {
    imageContext: image?.imageContext,
    imageUrl: image?.publicUrl,
    prompt: image?.prompt,
  };

  const {
    mutate: share,
    status: newStoryStatus,
    data: newStoryData,
  } = useNewStory({
    imageData: imageData,
    userId: session?.user.id || "",
  });

  useFocusEffect(() => {
    if (image?.publicUrl && newStoryData) {
      reset();
    }
  });

  console.log(image, "<--- the image");

  return (
    <ScreenBackground>
      <View style={styles.generatorCard}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image
              style={styles.image}
              source={{
                cache: "reload",
                uri: image && image.publicUrl,
              }}
              PlaceholderContent={<ActivityIndicator />}
            />
          ) : (
              <View style={styles.textContainer}>
                <Text style={styles.text}>
                  Click generate to create a unique image using AI to start a
                  new story!
                </Text>
                <Text style={styles.text}>
                  Share the generated image as a starting point and invite
                  friends to contibute to the story.
                </Text>
              </View>
          )}
        </View>

        <View>
          {image && image.publicUrl}
        </View>
        <View style={styles.buttons}>
          <Button
            type="solid"
            onPress={() => generate()}
            containerStyle={{ padding: 5, flexGrow: 1 }}
            loading={newImageStatus === "pending"}
            title={image?.publicUrl ? "Re-generate" : "Generate"}
          />
          <Button
            type="outline"
            containerStyle={{ padding: 5, flexGrow: 1 }}
            onPress={() => share()}
            disabled={!image?.publicUrl}
            title="Share"
          />
        </View>
      </View>
    </ScreenBackground>
  );
}
