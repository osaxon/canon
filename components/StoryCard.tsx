import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../App";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { timeAgo } from "../utils/timeFunctions";
import { Avatar } from "react-native-elements";

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
    margin: 10,
    paddingLeft: 10,
    textAlign: "center",
  },
  storyCard: {
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
    marginBottom: 40,
    margin: "auto",
  },
  avatarBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    backgroundColor: "lightgrey",
    borderRadius: 10,
  },
});

interface StoryCardProps {
  storyData: {
    id: number;
    story_id: number;
    profile_id: number;
    created_at: string | number | Date;
    image_url: string | null;
    comment_count: number | null;
    votes: number | null;
    profiles: { username: string | null; avatar_url: string | null } | null;
  };
}

const StoryCard = ({
  storyData: { id, story_id, profile_id, created_at, image_url, comment_count, votes, profiles },
}: StoryCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  return (
    <>
      <View style={styles.storyCard}>
        <TouchableOpacity onPress={() => navigation.navigate("FullStory", { story_id })}>
          <Image style={styles.image} source={{ uri: image_url! }} />
        </TouchableOpacity>

        <View style={styles.avatarBox}>
          <Avatar
          onPress={() => navigation.navigate("UserProfile", { user_id: profile_id })}
            size={"medium"}
            rounded
            containerStyle={{
              marginTop: 5,
              borderColor: "black",
              borderStyle: "solid",
              borderWidth: 1,
            }}
            source={{
              uri: profiles?.avatar_url
                ? profiles?.avatar_url
                : "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
            }}
          />
          <View>
            <Text style={styles.text}>{`${profiles?.username} posted ${timeAgo(created_at)}`}</Text>
            <Text style={styles.text}>{`${comment_count} comments, ${votes} votes`}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default StoryCard;
