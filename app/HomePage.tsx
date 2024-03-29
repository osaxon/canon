import React from 'react'
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import { StackParams, StoriesStackParams, UsersStackParams } from "../App";
import GenerateImage from "../components/GenerateImage";

export default function HomePage() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const storiesNavigation =
        useNavigation<NativeStackNavigationProp<StoriesStackParams>>();
    const usersNavigation =
        useNavigation<NativeStackNavigationProp<UsersStackParams>>();

    return (
        <>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                    <Text>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Profile", { user_id: 1 })
                    }
                >
                    <Text>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => storiesNavigation.navigate("Stories")}
                >
                    <Text>Stories</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => usersNavigation.navigate("Users")}
                >
                    <Text>Users</Text>
                </TouchableOpacity>
                <GenerateImage />
            </View>
        </>
    );
}
