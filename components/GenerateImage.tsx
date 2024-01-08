import { Button, Card } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import { GenerateImageResponse } from "../types/functions";
import { generateImage, storeImage } from "../utils/supabase";

const generateImageFromPrompt = async () => {
    const {
        data: { data },
        error,
    } = (await supabase.functions.invoke("generate-image")) as {
        data: GenerateImageResponse;
        error: any;
    };
    return { data, error };
};

const generateAndStoreImage = async () => {
    const fileName = `image-${new Date().toDateString()}`;
    try {
        const { revised_prompt, base64, url } = await generateImage({
            body: {},
        });

        const storedImageData = await storeImage({
            base64: base64,
            fileName: fileName,
            bucketName: "DALLEImages",
        });

        if (!storedImageData) {
            throw new Error("error storing the image");
        }

        const { data: publicImgData } = await supabase.storage
            .from("DALLEImages")
            .getPublicUrl(fileName);

        return publicImgData;
    } catch (error) {
        console.log(error, "<--- catch block error");
    }
};

export default function GenerateImage() {
    const { mutate: generate, data: image } = useMutation({
        mutationKey: ["seed-image"],
        mutationFn: generateAndStoreImage,
    });

    // return it as base64
    // store it in storage bucket
    // update db with url from bucket
    // update the story

    return (
        <SafeAreaView style={styles.container}>
            <Card>
                <Card.Image
                    source={{ uri: image && image.publicUrl }}
                    PlaceholderContent={<ActivityIndicator />}
                />
            </Card>
            <Card.FeaturedSubtitle>
                {image && image.publicUrl}
            </Card.FeaturedSubtitle>
            <Button color="primary" onPress={() => generate()}>
                Generate
            </Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 6,
    },
    card: {
        aspectRatio: 1,
        width: "100%",
        flex: 1,
    },
});
