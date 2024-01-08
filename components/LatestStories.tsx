import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";

interface LatestStoriesProps {
  userId: any;
}

const LatestStories: React.FC<LatestStoriesProps> = ({ userId }) => {
  // const [images, setImages] = useState<object | null>([]);

  // async function getStory() {
  //   try {
  //     const { data, error } = await supabase.storage
  //       .from("DALLEImages")
  //       .list("", {
  //         limit: 100,
  //         offset: 0,
  //         sortBy: { column: "created_at", order: "asc" },
  //       });

  //     if (error) {
  //       console.error("Error getting story: ", error);
  //     } else if (data) {
  //       setImages(data);
  //       console.log(data);
  //     }
  //   } catch (error) {
  //     console.error("Error getting story: ", error);
  //   }
  // }

  // useEffect(() => {
  //   getStory();
  // }, []);

  const fauxImages = [
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
    require("../assets/icon.png"),
  ];

  return (
    <>
      <Text style={styles.titleText}>Latest Stories</Text>
      <ScrollView>
        <View style={styles.storyContainer}>
          {fauxImages.map((source, index) => (
            <Image key={index} style={styles.stories} source={source} />
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
  },
  storyContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
  },
  stories: {
    width: 122,
    height: 122,
    borderRadius: 3,
    borderColor: "#333",
    borderWidth: 1,
    margin: 0,
  },
});
