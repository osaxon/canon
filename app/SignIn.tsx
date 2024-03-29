import { Button, Input, useTheme } from "@rneui/themed";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import ScreenBackground from "../components/ScreenBackground";
import { supabase } from "../lib/supabase";
import Auth from "./Auth";

export default function SignIn() {
    const { theme, updateTheme } = useTheme();
    const styles = StyleSheet.create({
        container: {
            padding: 14,
            height: "100%",
            backgroundColor: theme.colors?.grey5,
        },
        verticallySpaced: {
            paddingTop: 4,
            paddingBottom: 4,
            alignSelf: "stretch",
        },
        signOut: {
            paddingTop: 4,
            paddingBottom: 8,
            textAlign: "center",
        },
        mt20: {
            marginTop: 10,
        },
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        if (!session)
            Alert.alert("Please check your inbox for email verification!");
        setLoading(false);
    }

    return (
        <ScreenBackground>
            <View style={styles.container}>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Input
                        label="Email"
                        leftIcon={{ type: "font-awesome", name: "envelope" }}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={"none"}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <Input
                        label="Password"
                        leftIcon={{ type: "font-awesome", name: "lock" }}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Password"
                        autoCapitalize={"none"}
                    />
                </View>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Button
                        title="Sign in"
                        disabled={loading}
                        onPress={() => signInWithEmail()}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <Button
                        title="Sign up"
                        disabled={loading}
                        onPress={() => signUpWithEmail()}
                    />
                </View>
                <Auth />
            </View>
        </ScreenBackground>
    );
}
