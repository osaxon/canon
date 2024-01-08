import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Button, Input } from "react-native-elements";
import React from "react";

export default function AddToStory() {
  const [input, setInput] = useState("");
  const onSubmit = () => {
    setInput("");
  };
  return (
    <View>
      <Input value={input} onChangeText={setInput} placeholder="add to story..." />
      <Button title="Submit" onPress={onSubmit} />
    </View>
  );
}
