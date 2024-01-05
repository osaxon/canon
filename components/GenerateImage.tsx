import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { supabase } from "../lib/supabase";

// user clicks generate image
// 

const generateImageFromPrompt = async () => {
    const { data, error } = await supabase.functions.invoke("generate-image");
    return { data, error };
};

export default function GenerateImage() {
    const { data } = useQuery({
        queryKey: ["generated-image"],
        queryFn: generateImageFromPrompt,
    });

    return (
        <View>
            <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
    );
}
