import React from "react";
import './TopNav.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { LoginBubble } from "./react-components.jsx";
import { Tooltip } from "react-tooltip";
import blockchatLogo from "./blockchatlogo.png"
import invertedBlockchatLogo from "./invertedblockchatlogo.png"

/**
 * @component
 * @param {*} properties 
 * @description Child component representing the top navigation bar.
 */
function TopNav(properties) {

    /**
     * @description These are colour inversions to enable dark mode if the user has chosen that.
    */
    const txtColour = properties.isDarkMode ? "#000000" : "#ffffff";
    const frameColour = properties.isDarkMode ? "#bdbdbd" : "#444444";
    const logo = properties.isDarkMode ? invertedBlockchatLogo : blockchatLogo;

    /**
     * @description Refreshes the information held in these arrays when the refresh button is hit.
     */
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