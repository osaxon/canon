import { StyleSheet, View } from "react-native";
import EmailForm from "./components/EmailForm";

export default function App() {
    return (
        <View style={styles.container}>
            <EmailForm />
        </View>
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
