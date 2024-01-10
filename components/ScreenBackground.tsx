import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "@rneui/themed";
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientBackground: {
      flex: 1,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    forground: {
      flex: 1,
      position: "relative",
    },
  });


const ScreenBackground = ({ children }: any) => {

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["black","navy","royalblue"]}
        locations={[0.618,0.854,1]}
        style={styles.gradientBackground}
      />
      <View style={styles.forground}>{children}</View>
    </View>
  );
};

export default ScreenBackground;
