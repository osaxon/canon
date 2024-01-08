import { useState } from "react";
import { Button, Input } from "react-native-elements";
import React from "react";

type CollapsibleProps = {
    children: React.ReactNode,
    title: string,
    isCollapsed: boolean,
    setIsCollapsed: (val: boolean) => void
}

const Collapsible= ({children, title, isCollapsed, setIsCollapsed}: CollapsibleProps) => {
    // const [isCollapsed, setIsCollapsed] = useState(false)
    const toggleComments = () => {
        setIsCollapsed(!isCollapsed)
    }
    return (<>
        <Button title={isCollapsed ? "Show " + title : "Hide " + title} onPress={toggleComments} />
        
        {isCollapsed ? null : children}
    </>)
};

export default Collapsible;