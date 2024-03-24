import React from "react";
import './TopNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

function TopNav(properties) {
    return (
        <div className="topnav">
            <div className="left">
                <h1>BlockChat</h1>
            </div>
            <div className="right">
                <button onClick={properties.loadMessages}>
                    <FontAwesomeIcon icon={faSync} size="2x" />
                </button>
            </div>
        </div>
    );
}

export default TopNav;