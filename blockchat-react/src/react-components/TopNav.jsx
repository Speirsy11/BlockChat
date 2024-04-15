import React from "react";
import './TopNav.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { LoginBubble } from "./react-components.jsx";
import { Tooltip } from "react-tooltip";
import blockchatLogo from "./blockchatlogo.png"

function TopNav(properties) {

    function refresh() {
        properties.loadMessages();
        properties.loadContacts();
    }

    return (

        <div className="topnav">
            <div className="left">
                <img src={blockchatLogo} alt="Site Logo" className="logo" />
                <h1>BlockChat</h1>
            </div>
            <div className="right">
                <LoginBubble
                    username = {properties.username}
                />
                <button 
                    onClick={refresh}
                    data-tooltip-id="refresh-tooltip"
                    data-tooltip-content={"Refresh Page"}>
                        <FontAwesomeIcon icon={faSync} size="2x" />
                </button>
                <Tooltip id="refresh-tooltip"/>
            </div>
        </div>

    );
}

export default TopNav;