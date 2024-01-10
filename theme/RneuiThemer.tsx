import React from "react";
import { ThemeProvider, createTheme } from "@rneui/themed";

const theme = createTheme({
  lightColors: {
  },
  darkColors: {
  },
  mode:"light",
  components: {
    Button: {
      raised: true,
    },
  },
});



const RneuiThemer = ({ children }: any) => {
  return (
    <>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
};

export default RneuiThemer;
