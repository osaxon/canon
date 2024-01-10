import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList } from "react-native";
import { Image } from "react-native-elements";
import { StackParams } from "../App";
import AddToStory from "../components/AddToStory";
import Collapsible from "../components/Collapsible";
import Comments from "../components/Comments";
import StoryItemCard from "../components/StoryItemCard";
import Votes from "../components/Votes";
import { supabase } from "../lib/supabase";
import { Json, Tables } from "../types/database";
import { useFullStory } from "../utils/hooks";
import { generateNextImage, storeImage } from "../utils/supabase";

type Props = NativeStackScreenProps<StackParams, "FullStory">;
interface Story extends Tables<"story_items"> {
    profiles: { username: string | null; avatar_url: string | null } | null;
    stories: { comment_count: number | null; votes: number | null } | null;
}

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
    const { story_id, votes } = route.params;
    const [story, setStory] = useState<Story[] | null>(null);

    const queryClient = useQueryClient();

    const { data: fullStory } = useFullStory(story_id);
    // console.log(fullStory, "<<-- fullstory");
    
    const {
        mutate: generate,
        data: nextImage,
        status: nextImageStatus,
    } = useMutation({
        mutationKey: ["next-image"],
        mutationFn: (input: { prompt: string }) =>
            generateAndStoreImage({
                prompt: input.prompt,
                imgContext: fullStory?.image_context as Json,
            }),
    });

    // useEffect(() => {
    //     const getStory = async () => {
    //         const { data, error } = await supabase
    //             .from("story_items")
    //             .select(
    //                 "*, profiles(username,avatar_url), stories(comment_count, votes)"
    //             )
    //             .eq("story_id", story_id);
    //         setStory(data);
    //     };
    //     getStory();
    // }, []);

    return (
        <FlatList
            data={fullStory?.storyItems.sort((a,b) => {
               return a.id - b.id
            })}
            renderItem={({ item: storyItem }) => (
                <StoryItemCard storyItemData={storyItem as any} />
            )}
            ListFooterComponent={
                <>
                    {/* THE PREVIEW OF THE NEXT IMAGE IN THE SCENE */}
                    {nextImageStatus === "success" && (
                        <Image source={{ uri: nextImage?.publicUrl }} />
                    )}
                    <AddToStory generate={generate} />
                    <Collapsible title="Comments" icon="chat">
                        <Comments story_id={story_id} />
                    </Collapsible>
                    <Votes
                        story_id={story_id}
                        storyVotes={votes}
                        
                    />
                </>
            }
        />
    );
};

export default FullStory;
