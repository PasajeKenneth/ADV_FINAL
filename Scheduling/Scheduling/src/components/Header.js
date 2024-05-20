import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import "./Header.css"

const Header = () => {
    const [activeTab, setActiveTab] = useState("Home");
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/") {
            setActiveTab("Home")
        } 
    }, [location]);


    if (location.pathname === "/register" || location.pathname === "/") {
        return null;  
    }

    return (
       <div></div>
    );
};

export default Header;

