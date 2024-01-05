import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";

import { Avatar } from "react-native-elements";

const defaultUser = require("../assets/user.png");

const styles = StyleSheet.create({
  image: {
    maxWidth: "100%",
    width: 1000,
    maxHeight: "100%",
    height: "auto",
    borderRadius: 10,
    aspectRatio: 1,
  },
  text: {
    paddingLeft: 10,
  },
  StoryItemCard: {
    boxSixing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    aspectRatio: 1,
    minWidth: "50%",
    width: "100%",
    maxWidth: 500,
    height: "auto",
    maxheight: "100%",
    marginTop: 60,
    marginBottom:40,
    margin: "auto",
  },
  avatarBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
});

interface StoryItemCardProps {
  storyItemData: {
    id: number;
    story_id: number;
    user_id: number | null;
    created_at: string | null;
    image_url: string | null;
    comment_count: number | null;
    votes: number | null;
    prompt: string | null;
  };
}

const StoryItemCard = ({
  storyItemData: {
    id,
    story_id,
    user_id,
    created_at,
    image_url,
    comment_count,
    votes,
    prompt,
  },
}: StoryItemCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
  return (
    <>
      <View style={styles.StoryItemCard}>
          <Image style={styles.image} source={{ uri: image_url! }} />
        <Text
          style={styles.text}
        >{`${prompt}`}</Text>
        <View style={styles.avatarBox}>
          <Avatar
            size={"medium"}
            rounded
            containerStyle={{
              borderColor: "grey",
              borderStyle: "solid",
              borderWidth: 1,
            }}
            source={defaultUser}
          />
          <Text
            style={styles.text}
          >{`${user_id} posted on ${created_at}`}</Text>
        </View>
      </View>
    </>
  );
};

export default StoryItemCard;