import { SocialIcon } from "@rneui/themed";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { StyleSheet, View } from "react-native";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;

    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
    });
    if (error) throw error;
    return data.session;
};

const performGithubOAuth = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo,
            skipBrowserRedirect: true,
        },
    });
    if (error) throw error;

    console.log(data, "<--- data from singin");

    const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo
    );
    console.log(res, "<--- res obj");

    if (res.type === "success") {
        const { url } = res;
        await createSessionFromUrl(url);
    }
};

const performGoogleOAuth = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo,
            skipBrowserRedirect: true,
        },
    });
    if (error) throw error;

    console.log(data, "<--- data from singin");

    const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo
    );

    if (res.type === "success") {
        const { url } = res;
        await createSessionFromUrl(url);
    }
};

const sendMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
        email: "example@email.com",
        options: {
            emailRedirectTo: redirectTo,
        },
    });

    if (error) throw error;
    // Email sent.
};

export default function Auth() {
    // Handle linking into app from email app.
    const url = Linking.useURL();
    if (url) createSessionFromUrl(url);

    return (
        <>
            <View style={styles.container}>
                <SocialIcon
                    onPress={performGoogleOAuth}
                    title="Sign In With Google"
                    button
                    type="google"
                />
                <SocialIcon
                    onPress={performGithubOAuth}
                    title="Sign In With Github"
                    button
                    type="github"
                />
            </View>

            {/* <Button onPress={sendMagicLink} title="Send Magic Link" /> */}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 12,
        borderWidth: 2,
    },
});
