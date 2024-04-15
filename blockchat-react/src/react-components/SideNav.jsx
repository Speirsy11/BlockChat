import React from "react";
import './SideNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import metamaskGrey from "./metamaskgrey.png"
import metamaskOrange from "./metamaskorange.png"
import { Tooltip } from "react-tooltip";


function SideNav(properties) {
    return (
        <div className="sidenav">
            <div className="bottom">
                <button 
                    onClick={() => properties.openSettings()}
                    data-tooltip-id="settings-tooltip"
                    data-tooltip-content={"Open Settings"}>
                        <FontAwesomeIcon
                            icon={faCog}
                            size="2x"
                        />
                </button>
                <Tooltip id="settings-tooltip" />
                {greyOrOrange(properties)}
            </div>
        </div>
    );
}

function greyOrOrange(properties) {
    if (properties.walletAddress) {
        return(
            <div className="metamask-button">
                <button 
                    onClick={alreadyConnected}
                    data-tooltip-id="connected-metamask-tooltip"
                    data-tooltip-content={"You are already connected."}>
                        <img
                            src = {metamaskOrange}
                            alt="Orange MetaMask Icon"
                            className="set-image-size"
                        />
                </button>
                <Tooltip id="connected-metamask-tooltip" />
            </div>

        )
    }
    else {
        return (
            <div className="metamask-button">
                <button 
                    onClick={() => properties.blockchatLogin()}
                    data-tooltip-id="disconnected-metamask-tooltip"
                    data-tooltip-content={"Connect to MetaMask"}>
                        <img
                            src = {metamaskGrey}
                            alt="Grey MetaMask Icon"
                            className="set-image-size"
                        />
                </button>
                <Tooltip id="disconnected-metamask-tooltip" />
            </div>

        )
    }
}

function alreadyConnected() {
    alert("MetaMask is already connected.");
}

export default SideNav;