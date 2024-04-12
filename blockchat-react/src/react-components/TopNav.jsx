import React from "react";
import './TopNav.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { LoginBubble } from "./react-components.jsx";

function TopNav(properties) {

    function refresh() {
        properties.loadMessages();
        properties.loadContacts();
    }

    return (

        <div className="topnav">
            <div className="left">
                <h1>BlockChat</h1>
            </div>
            <div className="right">
                <LoginBubble
                    username = {properties.username}
                />
                <button onClick={refresh}>
                    <FontAwesomeIcon icon={faSync} size="2x" />
                </button>
            </div>
        </div>

    );
}

export default TopNav;