import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { supabase } from "../lib/supabase";
import { Tables } from "../types/database";

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
    //   const [stories, setStories] = useState<
    //     Database["public"]["Tables"]["story_items"]["Row"][] | null
    //   >(null);
    const [stories, setStories] = useState<Tables<"story_items">[] | null>(
        null
    );

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
            <View style={styles.container}>
                <Text>{JSON.stringify(stories)}</Text>
                <Image
                    style={styles.stretch}
                    source={{ uri: stories[0].image_url! }}
                />
            </View>
        </>
    );
}

export default Stories;
