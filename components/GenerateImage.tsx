import { Image } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "../lib/supabase";
import { GenerateImageResponse } from "../types/functions";

const styles = StyleSheet.create({
    list: {
        width: "100%",
        backgroundColor: "#000",
    },
    item: {
        aspectRatio: 1,
        width: "100%",
        flex: 1,
    },
});

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
        <View>
            <Text>Create new</Text>
            <Image
                source={{ uri: image?.data[0].url }}
                containerStyle={styles.item}
            />
            {image && <Text>{JSON.stringify(image)}</Text>}
        </View>
    );
}
