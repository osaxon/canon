import { Button } from '@rneui/themed';
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type CollapsibleProps = {
    children: React.ReactNode,
    title: string,
    icon: string
}

const styles = StyleSheet.create({
    showCommentButton: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "flex-start",
        padding:0,
        borderRadius: 20,
      },
      textAndButton: {
        margin:"auto",
        marginBottom:10,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "flex-start",
        border: "solid 1px silver",
        borderRadius: 10,
        width:"100%",
        padding:0,
        backgroundColor:"grey",
      },
      text: {
        color:"white",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "flex-start",
        margin:5,
        fontSize:16,
        fontWeight:"bold",
        borderRadius: 20,
      },
    })

const Collapsible= ({children, title, icon}: CollapsibleProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true)
    const toggleComments = () => {
        setIsCollapsed(!isCollapsed)
    }
    return (<>
        <View style={styles.textAndButton}>
        <Text style={styles.text}>{title+" "}<MaterialIcons name={icon} color={"white"} size={18} /></Text>
        <Button size={"sm"} style={styles.showCommentButton} onPress={toggleComments} >
        {isCollapsed ? 
        <MaterialIcons name={"expand-more"} color={"white"} size={22} />: 
        <MaterialIcons name={"expand-less"} color={"white"} size={22} />}
        </Button>
        </View>
        {isCollapsed ? null : children}
    </>)
};

export default Collapsible;

