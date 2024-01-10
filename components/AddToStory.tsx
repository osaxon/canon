import { UseMutateFunction } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Input, Text, Image } from "react-native-elements";
import { ImageContext } from "../types/functions";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const styles = StyleSheet.create({
  text: {
    marginTop: 5,
    paddingLeft: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  addToStoryBox: {
    boxSixing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    height: "auto",
    maxheight: "100%",
    margin: 0,
    marginLeft: 5,
    width: "100%",
    maxWidth: "82%",
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
  avatarBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
  },
  inputBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderColor: "silver",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  generateSubmitButton: {
    flexDirection: "row",
    borderRadius: 20,
    marginTop: 5,
    margin: 5,
  },
  cancelButton: {
    flexDirection: "row",
    borderRadius: 20,
    marginTop: 5,
    margin: 5,
  },
  avatarInputSubmitBox: {
    boxSixing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    minWidth: "50%",
    width: "100%",
    maxWidth: 500,
    height: "auto",
    maxheight: "100%",
    marginBottom: 20,
    margin: "auto",
    borderRadius: 10,
    padding: 0,
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: 10,
    aspectRatio: 1,
    margin: 0,
  },
});

export default function AddToStory({
  generate,
  nextImage,
  reset,
  nextImageStatus,
  story_id,
  refetch,
}: {
  generate: UseMutateFunction<
    | { prompt: string; imageContext: ImageContext; publicUrl: string }
    | undefined,
    Error,
    { prompt: string },
    unknown
  >;
  nextImage:
    | {
        prompt: string;
        imageContext: ImageContext;
        publicUrl: string;
      }
    | undefined;
  reset: () => void;
  story_id: number;
  nextImageStatus: "error" | "idle" | "pending" | "success";
  refetch: () => void;
}) {
  const [input, setInput] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const addNewStoryItem = async (
    prompt: string,
    image_url: string,
    profile_id: string,
    story_id: number
  ) => {
    const { data: storyItem, error } = await supabase
      .from("story_items")
      .insert({
        prompt: prompt,
        image_url: image_url,
        story_id: story_id,
        profile_id: profile_id,
      })
      .select()
      .throwOnError();

    if (!storyItem) {
      console.error("failed to create new story item");
      throw new Error("failed to create new story item");
    }

    console.log(storyItem, "<--- the new story item");

    return storyItem || [];
  };

  return (
    <View>
      <View style={styles.avatarInputSubmitBox}>
        <View style={styles.avatarBox}>
          <Avatar
            size={"medium"}
            rounded
            containerStyle={{
              borderColor: "grey",
              borderStyle: "solid",
              borderWidth: 1,
              marginTop: 5,
              marginLeft: 5,
            }}
            source={{
              uri: "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
            }}
          />
        </View>
        <View style={styles.addToStoryBox}>
          <Text style={styles.text}>How Should the Story Continue?</Text>
          <Input
            style={styles.inputBox}
            value={input}
            onChangeText={setInput}
            placeholder="Write what you think should happen next..."
            multiline
          />
          {nextImage && (
            <>
              <Text style={{ textAlign: "center" }}>{nextImage.prompt}</Text>
              <Image
                style={styles.image}
                source={{ uri: nextImage?.publicUrl }}
              />
            </>
          )}
          <View style={styles.buttons}>
            {nextImage && (
              <Button
                style={styles.cancelButton}
                title="Cancel"
                buttonStyle={{ backgroundColor: "red" }}
                onPress={reset}
              />
            )}
            <Button
              style={styles.generateSubmitButton}
              title={nextImage && session ? "Submit" : "Generate"}
              onPress={
                nextImage && session
                  ? () => {
                      addNewStoryItem(
                        nextImage.prompt,
                        nextImage.publicUrl,
                        session?.user.id!,
                        story_id
                      )
                        .then(() => reset())
                        .then(() => {
                          refetch();
                        });
                    }
                  : () => {
                      generate({ prompt: input });
                      setInput("");
                    }
              }
              disabled={!session || !input || nextImageStatus === "pending"}
              loading={nextImageStatus === "pending"}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
