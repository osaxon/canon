import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";
import { useFocusEffect } from "@react-navigation/native";

interface LatestStoriesProps {
  userId: any;
}

const LatestStories: React.FC<LatestStoriesProps> = ({ userId }) => {
  const [session, setSession] = useState<Session | null>(null);

  const sessionUserId = session?.user?.id || "";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const [images, setImages] = useState<
    {
      votes: number | null;
      id: number;
      first_image_url: string;
    }[]
  >([]);

  async function getStory() {
    if (!userId || !sessionUserId) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("stories")
        .select("first_image_url, id, votes")
        .eq("created_by", userId || sessionUserId);

      if (error) {
        console.error("Error getting story: ", error);
      } else if (data) {
        setImages(data);
      }
    } catch (error) {
      console.error("Error getting story: ", error);
    }
  }

  useFocusEffect(() => {
    getStory();
  });

  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  return (
    <>
      <Text style={styles.titleText}>Your Latest Stories</Text>
      <ScrollView>
        <View style={styles.storyContainer}>
          {images.map((item) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("FullStory", {
                  story_id: item.id,
                  votes: item.votes,
                })
              }
              key={item.id}
            >
              <Image
                key={item.id}
                style={styles.stories}
                source={{ uri: item.first_image_url }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default LatestStories;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#262626",
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  storyContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
    width: "100%",
  },
  stories: {
    width: 124,
    height: 124,
    borderColor: "#333",
    borderWidth: 1,
    margin: 1,
  },
});
