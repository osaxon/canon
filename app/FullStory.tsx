import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { StackParams } from "../App";
import AddToStory from "../components/AddToStory";
import Collapsible from "../components/Collapsible";
import Comments from "../components/Comments";
import StoryItemCard from "../components/StoryItemCard";
import Votes from "../components/Votes";
import { supabase } from "../lib/supabase";
import { Json } from "../types/database";
import { useFullStory } from "../utils/hooks";
import { generateNextImage, storeImage } from "../utils/supabase";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

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

const FullStory: React.FC<Props> = ({ route, navigation }) => {
  const { story_id, storyVotes, setStoryVotes } = route.params;

  const { data: fullStory, refetch } = useFullStory(story_id);

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
    <KeyboardAwareFlatList
      extraHeight={180}
      data={fullStory?.storyItems}
      renderItem={({ item: storyItem }) => (
        <StoryItemCard storyItemData={storyItem as any} />
      )}
      ListFooterComponent={
        <>
          {/* THE PREVIEW OF THE NEXT IMAGE IN THE SCENE */}
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
          <Votes
            story_id={story_id}
            storyVotes={storyVotes}
            setStoryVotes={setStoryVotes}
          />
        </>
      }
    />
  );
};

export default FullStory;
