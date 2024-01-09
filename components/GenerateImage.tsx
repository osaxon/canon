import { useFocusEffect } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Image, Text } from "react-native-elements";
import { supabase } from "../lib/supabase";
import { ImageData } from "../types/functions";
import { useNewStory } from "../utils/hooks";
import { generateImage, storeImage } from "../utils/supabase";

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
  const [session, setSession] = useState<Session | null>(null);

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
    <SafeAreaView style={styles.container}>
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
        <Card.FeaturedSubtitle style={styles.image}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              justifyContent: "center",
            }}
          >
            <Text h2 style={{ textAlign: "center", opacity: 0.5 }}>
              Click generate to create a unique image using AI to start a new
              story!
            </Text>
            <Text h2 style={{ textAlign: "center", opacity: 0.5 }}>
              Share the generated image as a starting point and invite friends
              to contibute to the story.
            </Text>
          </View>
        </Card.FeaturedSubtitle>
      )}

      <Card.FeaturedSubtitle>{image && image.publicUrl}</Card.FeaturedSubtitle>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 6,
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: 10,
    aspectRatio: 1,
    margin: 0,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
});
