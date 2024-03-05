import React from "react";
import './SideNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { GreyMetaMaskIcon } from "./CustomIcons"

function SideNav() {
    return (
        <div className="sidenav">
            <div className="bottom">
                <button>
                    <FontAwesomeIcon icon={faCog} size="2x" />
                </button>
                <button>
                    <GreyMetaMaskIcon />
                </button>
            </div>
        </div>
    );
}

export default SideNav;