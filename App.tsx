import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Session } from "@supabase/supabase-js";
import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Auth from "./app/Auth";
import Profile from "./app/Profile"
import { supabase } from "./lib/supabase";
import Explore from "./app/Explore";
import Stories from "./app/Stories";
import StoryAdd from "./app/StoryAdd";
import StoryConfirm from "./app/StoryConfirm";
import FullStory from "./app/FullStory";
import HomePage from "./app/HomePage";
import StoryComments from "./app/StoryComments";
import UserProfile from "./app/UserProfile"
import Users from "./app/Users";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

export type StackParams = {
    Home: any;
    SignIn: any;
    Explore: any,
    StoriesStack: StoriesStackParams,
    Profile: {user_id: number}
    UserProfile: {user_id: number}
    StoryAdd: {story_id: number},
    StoryConfirm: {story_id: number},
    FullStory: {story_id: number},
    StoryComments: {story_id: number}
    UsersStack: UsersStackParams
};

const Stack = createBottomTabNavigator<StackParams>();

export type StoriesStackParams = {
    Stories: any,
    StoryAdd: {story_id: number},
    StoryConfirm: {story_id: number},
    FullStory: {story_id: number},
    StoryComments: {story_id: number}
}
const StoriesStack = createNativeStackNavigator<StoriesStackParams>();
const StoriesScreenStack = () => {
    return (
        <StoriesStack.Navigator>
            <StoriesStack.Screen name = "Stories" component = {Stories}/>
            <StoriesStack.Screen name="StoryAdd" component={StoryAdd} options = {{title: "Add"}}/>
            <StoriesStack.Screen name="StoryConfirm" component={StoryConfirm} options = {{title: "Confirm"}}/>
            <StoriesStack.Screen name="FullStory" component={FullStory} options = {{title: "Full Story"}}/>
            <StoriesStack.Screen name="StoryComments" component={StoryComments} options = {{title: "Comments"}}/>
        </StoriesStack.Navigator>
    )
}

export type UsersStackParams = {
    Users: any,
    UserProfile: {user_id: number}
}
const UsersStack = createNativeStackNavigator<UsersStackParams>();
const UsersScreenStack = () => {
    return (
        <UsersStack.Navigator>
            <UsersStack.Screen name="Users" component={Users} options = {{title: "Users"}}/>
            <UsersStack.Screen name="UserProfile" component={UserProfile} options = {{title: "Profile"}}/>
        </UsersStack.Navigator>
    )
}

export default function App() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    console.log(session, "<--- session");

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomePage} />
                <Stack.Screen name="SignIn" component={Auth} />
                <Stack.Screen name="Explore" component={Explore} />
                <Stack.Screen name="StoriesStack" component={StoriesScreenStack} />
                <Stack.Screen name="Profile" component={Profile} options = {{title: "Profile"}}/>
                <Stack.Screen name="UsersStack" component={UsersScreenStack} options = {{title: "Users"}}/>
                
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
