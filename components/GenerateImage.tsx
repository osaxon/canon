import { Button, Card } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
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
        data: image,
        status,
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

    const { mutate: share, isPending } = useNewStory({
        imageData: imageData,
        userId: session?.user.id || "",
    });

    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.image}
                source={{
                    uri: image && image.publicUrl,
                }}
            />
            <Card.FeaturedSubtitle>
                {image && image.publicUrl}
            </Card.FeaturedSubtitle>
            <Button color="primary" onPress={() => generate()}>
                Generate
            </Button>
            <Button color="secondary" onPress={() => share()}>
                Share
            </Button>
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
        width: 1000,
        maxHeight: "80%",
        height: "auto",
        borderRadius: 10,
        aspectRatio: 1,
    },
});
