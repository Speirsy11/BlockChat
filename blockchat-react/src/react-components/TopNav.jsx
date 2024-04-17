import React from "react";
import './TopNav.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { LoginBubble } from "./react-components.jsx";
import { Tooltip } from "react-tooltip";
import blockchatLogo from "./blockchatlogo.png"
import invertedBlockchatLogo from "./invertedblockchatlogo.png"

function TopNav(properties) {

    const bgColour = properties.isDarkMode ? "#000000" : "#ffffff"
    const txtColour = properties.isDarkMode ? "#000000" : "#ffffff"
    const frameColour = properties.isDarkMode ? "#bdbdbd" : "#444444"
    const logo = properties.isDarkMode ? invertedBlockchatLogo : blockchatLogo

    function refresh() {
        properties.loadMessages();
        properties.loadContacts();
    }

    return (

        <div
            className="topnav"
            style={{backgroundColor: frameColour, color: txtColour}}
            >
                <div className="left">
                    <img src={logo} alt="Site Logo" className="logo" />
                    <h1>BlockChat</h1>
                </div>
                <div className="right">
                    <LoginBubble
                        username = {properties.username}
                        isDarkMode = {properties.isDarkMode}
                    />
                    <button 
                        onClick={refresh}
                        data-tooltip-id="refresh-tooltip"
                        data-tooltip-content={"Refresh Page"}
                        >
                            <FontAwesomeIcon
                                icon={faSync} size="2x"
                                style={{color: txtColour}}
                            />
                    </button>
                    <Tooltip id="refresh-tooltip"/>
                </div>
        </div>

    );
}

export default TopNav;