import React from "react";
import "./DisplayContactCard.css"

function DisplayContactCard(properties) {
    return (
    <div className={`contact-card ${properties.selected ? "selected" : ""}`}
    onClick={properties.onClick}>
        <div className = "name">
            {properties.contact.username}
        </div>
        <div className="address">
            {properties.contact.walletAddress}
        </div>
    </div>);
}

export default DisplayContactCard;