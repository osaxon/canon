import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { StackParams } from "../App";
import AddToStory from "../components/AddToStory";
import Collapsible from "../components/Collapsible";
import Comments from "../components/Comments";
import StoryItemCard from "../components/StoryItemCard";
import Votes from "../components/Votes";
import ScreenBackground from "../components/ScreenBackground";
import { supabase } from "../lib/supabase";
import { Json, Tables } from "../types/database";
import { useFullStory } from "../utils/hooks";
import { generateNextImage, storeImage } from "../utils/supabase";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@rneui/themed";

type Props = NativeStackScreenProps<StackParams, "FullStory">;

const generateAndStoreImage = async ({
  prompt,
  imgContext,
}: {
  prompt: string;
  imgContext: Json;
}) => {
  const fileName = `generated_images/image-${new Date().valueOf()}.jpg`;
  try {
    const { image, imageContext } = await generateNextImage({
      imageContext: imgContext,
      prompt,
    });

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
interface Story extends Tables<"story_items"> {
  profiles: { username: string | null; avatar_url: string | null } | null;
  stories: { comment_count: number | null; votes: number | null } | null;
}

const FullStory: React.FC<Props> = ({ route, navigation }) => {
  const { story_id, votes } = route.params;

  const { data: fullStory, refetch } = useFullStory(story_id);
  const { theme, updateTheme } = useTheme();
  const styles = StyleSheet.create({
    votesContainer: {
      flex:1,
      alignItems:"center",
      justifyContent:"center",
      padding: "auto",
      borderColor: theme.colors?.grey4,
      borderStyle: "solid",
      marginLeft: "auto",
      marginRight: "auto",
      paddingBottom: 5,
      backgroundColor: theme.colors?.grey4,
    },
  })
  const {
    mutate: generate,
    data: nextImage,
    status: nextImageStatus,
    reset,
  } = useMutation({
    mutationKey: ["next-image"],
    mutationFn: (input: { prompt: string }) =>
      generateAndStoreImage({
        prompt: input.prompt,
        imgContext: fullStory?.image_context as Json,
      }),
  });
  console.log(nextImage?.publicUrl);
  return (
    <ScreenBackground>
      <KeyboardAwareFlatList
        extraHeight={180}
        data={fullStory?.storyItems.sort((a, b) => {
          return a.id - b.id;
        })}
        renderItem={({ item: storyItem }) => (
          <StoryItemCard storyItemData={storyItem as any} />
        )}
        ListHeaderComponent={
          <View style={styles.votesContainer}>
            <Votes story_id={story_id} storyVotes={votes} />
          </View>

        }
        ListFooterComponent={
          <>
            <AddToStory
              generate={generate}
              nextImage={nextImage}
              reset={reset}
              nextImageStatus={nextImageStatus}
              story_id={story_id}
              refetch={refetch}
            />
            <Collapsible title="Comments" icon="chat">
              <Comments story_id={story_id} />
            </Collapsible>
          </>
        }
      />
    </ScreenBackground>
  );
};

export default FullStory;
