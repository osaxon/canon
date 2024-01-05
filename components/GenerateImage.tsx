import { Button, Card } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import { GenerateImageResponse } from "../types/functions";

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

export default function GenerateImage() {
    const { mutate: generate, data: image } = useMutation({
        mutationKey: ["seed-image"],
        mutationFn: async () => {
            const { data } = (await supabase.functions.invoke(
                "generate-image",
                { body: {} }
            )) as { data?: GenerateImageResponse };

            const { data: image } = data || { data: undefined };

            return image?.[0] || undefined;
        },
    });

    // return it as base64
    // store it in storage bucket
    // update db with url from bucket
    // update the story

    return (
        <SafeAreaView style={styles.container}>
            <Card>
                <Card.Image
                    source={{ uri: image && image.url }}
                    PlaceholderContent={<ActivityIndicator />}
                />
            </Card>
            <Card.FeaturedSubtitle>
                {image && image.revised_prompt}
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
