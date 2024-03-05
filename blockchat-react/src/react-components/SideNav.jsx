import React from "react";
import './SideNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

function SideNav() {
    return (
        <div class="sidenav">
            <ul>
                <li><a href = "#"><FontAwesomeIcon icon = {faCog} /></a></li>
            </ul>
        </div>
    );
}

export default SideNav;