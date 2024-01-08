import { useState } from "react";
import { Button, Input } from "react-native-elements";
import React from "react";

type CollapsibleProps = {
    children: React.ReactNode,
    title: string,
}

const Collapsible= ({children, title}: CollapsibleProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true)
    const toggleComments = () => {
        setIsCollapsed(!isCollapsed)
    }
    return (<>
        <Button title={isCollapsed ? "Show " + title : "Hide " + title} onPress={toggleComments} />
        
        {isCollapsed ? null : children}
    </>)
};

export default Collapsible;