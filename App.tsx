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



export type StackParams = {
    Home: any;
    SignIn: any;
    Explore: any,
    Stories: any,
    Profile: {user_id: number}
    StoryAdd: {story_id: number},
    StoryConfirm: {story_id: number},
    FullStory: {story_id: number},


};


const Stack = createNativeStackNavigator<StackParams>();

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
                <Stack.Screen name="Stories" component={Stories} />
                <Stack.Screen name="StoryAdd" component={StoryAdd} options = {{title: "Add"}}/>
                <Stack.Screen name="StoryConfirm" component={StoryConfirm} options = {{title: "Confirm"}}/>
                <Stack.Screen name="FullStory" component={FullStory} options = {{title: "Full Story"}}/>
                <Stack.Screen name="Profile" component={Profile} options = {{title: "Profile"}}/>

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
