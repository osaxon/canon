import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";

const NavigationThemer = ({ children }: any) => {
  const { theme, updateTheme } = useTheme()
  const reactNavTheme = {
    dark: true,
    colors: {
      primary: theme.colors?.primary,
      background: theme.colors?.grey4,
      card: theme.colors?.grey5,
      text: theme.colors?.black,
      border: theme.colors?.divider,
      notification: 'rgb(255, 69, 58)',
    },
  };

  return (
    <>
            <NavigationContainer theme={reactNavTheme}>
{children}
      </NavigationContainer>
    </>
  );
};

export default NavigationThemer;
