import React from "react";
import "./DisplayContactCard.css"

function DisplayContactCard(properties) {

    console.log("Dark Mode:", properties.isDarkMode);
    console.log(properties.isDarkMode ? "#000000" : "#ffffff")

    const frameColour = properties.isDarkMode ? "3px solid #bdbdbd" : "3px solid #444444"

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