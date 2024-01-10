import { Text } from "@rneui/themed";
import React from "react";

type ErrorProps = {
    message: string
}

const Error = ({ message } : ErrorProps) => {
    return <Text>{message}</Text>;
  };
  
  export default Error;
  