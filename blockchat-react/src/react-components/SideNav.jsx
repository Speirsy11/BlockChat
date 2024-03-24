import React from "react";
import './SideNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import metamaskGrey from "./metamaskgrey.png"
import metamaskOrange from "./metamaskorange.png"


function SideNav(properties) {
    return (
        <div className="sidenav">
            <div className="bottom">
                <button>
                    <FontAwesomeIcon icon={faCog} size="2x" />
                </button>
                {greyOrOrange(properties)}
            </div>
        </div>
    );
}

function greyOrOrange(properties) {
    console.log(properties.walletAddress);
    if (properties.walletAddress) {
        return(
            <button onClick={alreadyConnected}>
            <img
            src = {metamaskOrange}
            alt="Orange MetaMask Icon"
            className="set-image-size"
            />
            </button>
        )
    }
    else {
        return (
            <button onClick={() => properties.blockchatLogin()}>
            <img
            src = {metamaskGrey}
            alt="Grey MetaMask Icon"
            className="set-image-size"
            />
            </button>
        )
    }
}

function alreadyConnected() {
    alert("MetaMask is already connected.");
}

export default SideNav;