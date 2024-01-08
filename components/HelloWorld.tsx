import React from 'react'
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { supabase } from "../lib/supabase";

export default function HelloWorld() {
    const [msg, setMsg] = useState<{ message: string } | null>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMsg = async () => {
            const { data, error } = await supabase.functions.invoke(
                "hello-world",
                { body: { name: "from the other side!" } }
            );

            if (error) setError(error);

            setMsg(data);
        };
        fetchMsg();
    }, []);

    return (
        <View>
            <Text>{JSON.stringify(msg, null, 2)}</Text>
        </View>
    );
}
