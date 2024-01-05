import { Card } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
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
    const { data: image } = useQuery({
        queryKey: ["generated-image"],
        queryFn: generateImageFromPrompt,
    });

    return (
        <SafeAreaView style={styles.container}>
            <Card>
                <Card.Image source={{ uri: image?.data[0].url }} />
            </Card>
            <Card.FeaturedSubtitle>
                {image?.data[0].revised_prompt}
            </Card.FeaturedSubtitle>
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
