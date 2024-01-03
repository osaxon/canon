import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import { StackParams } from "../App";
import HelloWorld from "../components/HelloWorld";

export default function HomePage() {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    return (
        <>
            <View>
                <TouchableOpacity onPress={() => navigation.push("Home")}>
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
                    onPress={() => navigation.navigate("Stories")}
                >
                    <Text>Stories</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Users")}>
                    <Text>Users</Text>
                </TouchableOpacity>
                <HelloWorld />
            </View>
        </>
    );
}
