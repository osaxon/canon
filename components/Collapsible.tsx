import { useTheme } from '@rneui/themed';
import { Button } from '@rneui/themed';
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type CollapsibleProps = {
    children: React.ReactNode,
    title: string,
    icon: string
}



const Collapsible= ({children, title, icon}: CollapsibleProps) => {
  const { theme, updateTheme } = useTheme()
  const styles = StyleSheet.create({
    showCommentButton: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "flex-start",
        padding:0,
        borderRadius: 20,
      },
      buttonContainer:{
        padding:0,
        borderRadius:10,
      },
      textAndButton: {
        margin:"auto",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "flex-start",
        borderColor: theme.colors?.grey2,
        borderStyle: "solid",
        borderWidth:1,
        width:"100%",
        padding:0,
        backgroundColor:theme.colors?.grey3,
      },
      text: {
        color:theme.colors?.white,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "flex-start",
        margin:5,
        fontSize:16,
        fontWeight:"bold",
        borderRadius: 20,
      },
    })
    const [isCollapsed, setIsCollapsed] = useState(false)
    const toggleComments = () => {
        setIsCollapsed(!isCollapsed)
    }
    return (<>
        <View style={styles.textAndButton}>
        <Text style={styles.text}>{title+" "}<MaterialIcons name={icon} color={"white"} size={18} /></Text>
        <View style={styles.buttonContainer}>
        <Button size={"sm"} style={styles.showCommentButton} onPress={toggleComments} >
        {isCollapsed ? 
        <MaterialIcons name={"expand-more"} color={theme.colors?.white} size={22} />: 
        <MaterialIcons name={"expand-less"} color={theme.colors?.white} size={22} />}
        </Button>
        </View>
        </View>
        {isCollapsed ? null : children}
    </>)
};

export default Collapsible;

