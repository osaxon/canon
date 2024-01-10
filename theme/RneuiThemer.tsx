import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider, createTheme } from "@rneui/themed";

const elementsTheme = createTheme({
  lightColors: {
    primary: "red",
  },
  darkColors: {
    primary: "blue",
  },
  components: {
    Button: {
      raised: true,
    },
  },
});

const RneuiThemer = ({ children }: any) => {
  return (
    <>
      <ThemeProvider theme={elementsTheme}>{children}</ThemeProvider>
    </>
  );
};

export default RneuiThemer;
