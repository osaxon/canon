import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { StackParams } from "../App";
import GenerateImage from "../components/GenerateImage";
import { Database } from "../database.types";
import { supabase } from "../lib/supabase";

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
    },
    stretch: {
        width: 50,
        height: 200,
    },
});

function Stories() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const [stories, setStories] = useState<
        Database["public"]["Tables"]["story_items"]["Row"][] | null
    >(null);

    useEffect(() => {
        const getStories = async () => {
            let { data, error } = await supabase
                .from("story_items")
                .select("*");
            setStories(data);
        };
        getStories();
    }, []);

    if (!stories) return null;
    return (
        <>
            <View>
                <GenerateImage />
            </View>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("StoryAdd", {
                        story_id: stories[0].story_id!,
                    })
                }
            >
                <View style={styles.container}>
                    <Text>{JSON.stringify(stories)}</Text>
                    <Image
                        style={styles.stretch}
                        source={{ uri: stories[0].image_url! }}
                    />
                </View>
            </TouchableOpacity>
        </>
    );
}

export default Stories;
