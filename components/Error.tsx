import { Text } from "react-native-elements";
import React from "react";

type ErrorProps = {
    message: string
}

const Error = ({ message } : ErrorProps) => {
    return <Text>{message}</Text>;
  };
  
  export default Error;
  