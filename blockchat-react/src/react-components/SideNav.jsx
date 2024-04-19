import React from "react";
import './SideNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import metamaskGrey from "./metamaskgrey.png"
import metamaskOrange from "./metamaskorange.png"
import { Tooltip } from "react-tooltip";

/**
 * @component
 * @param {*} properties 
 * @description Child component representing the side navigation bar.
 */
function SideNav(properties) {

    /**
     * @description These are colour inversions to enable dark mode if the user has chosen that.
    */
    const txtColour = properties.isDarkMode ? "#000000" : "#ffffff";
    const frameColour = properties.isDarkMode ? "#bdbdbd" : "#444444";

    return (
        <div
            className="sidenav"
            style={{backgroundColor: frameColour}}
        >
            <div className="bottom">
                <button 
                    onClick={() => properties.openSettings()}
                    data-tooltip-id="settings-tooltip"
                    data-tooltip-content={"Open Settings"}>
                        <FontAwesomeIcon
                            icon={faCog}
                            size="2x"
                            style={{color: txtColour}}
                        />
                </button>
                <Tooltip id="settings-tooltip" />
                {greyOrOrange(properties)}
            </div>
        </div>
    );
}

/**
 * @param {*} properties 
 * @description This function checks if the user is connected to the site through MetaMask. If they are, it returns an orange MetaMask logo whereas it is returned as greyed out if they are not.
 * @returns {React Button}
 */
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

/**
 * @description Alerts the user that their wallet is already connected.
 * @returns {void}
 */
function alreadyConnected() {
    alert("MetaMask is already connected.");
}

export default SideNav;