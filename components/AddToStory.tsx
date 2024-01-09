import { useState } from "react";
import { View, StyleSheet,} from "react-native";
import { Button, Input, Card, Avatar,Text } from "react-native-elements";
import React from "react";

const styles = StyleSheet.create({
  text: {
    marginTop: 5,
    paddingLeft: 10,
    textAlign: "center",
    fontWeight: "bold"
  },
  addToStoryBox: {
    boxSixing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    height: "auto",
    maxheight: "100%",
    margin: 0,
    marginLeft:5,
    width: "100%", 
    maxWidth: "82%",
    backgroundColor: "lightgrey",
    borderRadius:10,
  },
  avatarBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
  },
  inputBox: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderColor: "silver",
    borderStyle: "solid",
    borderWidth:1,
    padding: 5,
  },
  submitButton: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
    borderRadius: 20,
    marginTop: 5,
    margin: 10,
  },
  avatarInputSubmitBox: {
    boxSixing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    minWidth: "50%",
    width: "100%",
    maxWidth: 500,
    height: "auto",
    maxheight: "100%",
    marginBottom: 20,
    margin: "auto",
    borderRadius: 10,
    padding: 0,
  },
});

export default function AddToStory() {
  const [input, setInput] = useState("");
  const onSubmit = () => {
    setInput("");
  };
  return (
    <View style={styles.avatarInputSubmitBox}>
      <View style={styles.avatarBox}>
        <Avatar
          size={"medium"}
          rounded
          containerStyle={{
            borderColor: "grey",
            borderStyle: "solid",
            borderWidth: 1,
            marginTop: 5,
            marginLeft: 5,
          }}
          source={{
            uri: "https://ykmnivylzhcxvtsjznhb.supabase.co/storage/v1/object/public/avatars/user.png",
          }}
        />
      </View>
      <View style={styles.addToStoryBox}>
        <Text style={styles.text}>How Should the Story Continue?</Text>
        <Input
          style={styles.inputBox}
          value={input}
          onChangeText={setInput}
          placeholder="Write what you think should happen next..."
          multiline
        />
        <Button style={styles.submitButton} title="Submit" onPress={onSubmit} />
      </View>
    </View>
  );
}
