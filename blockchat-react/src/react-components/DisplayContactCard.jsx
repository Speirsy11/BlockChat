import React from "react";
import "./DisplayContactCard.css"

    /**
     * @component
     * @param {*} properties 
     * @description Simple card that displays the contact's information to the user.
     */
function DisplayContactCard(properties) {

    /**
     * @description These are colour inversions to enable dark mode if the user has chosen that. They also handle changing the appearance of the contact that is selected.
     */
    const frameColour = properties.isDarkMode ? "3px solid #bdbdbd" : "3px solid #444444";
    const unselectedStyle = {
        backgroundColor: properties.isDarkMode ? "#000000" : "#ffffff",
        color: properties.isDarkMode ? "#ffffff" : "#000000",
        borderBottom: frameColour
      };
      const selectedStyle = {
        backgroundColor: properties.isDarkMode ? "#272727" :  "#e2e2e2",
        color: properties.isDarkMode ? "#ffffff" : "#000000",
        borderBottom: frameColour,
        fontWeight: "bold"
      };
    const style = properties.selected ? selectedStyle : unselectedStyle

    return (
        <div
            className= "contact-card"
            style={style}
            onClick={properties.onClick}
        >
            <div className = "name">
                {properties.contact.username}
            </div>
            <div className="address">
                {properties.contact.walletAddress}
            </div>
        </div>);
}

export default DisplayContactCard;