import React from "react";

function DisplayContactCard(properties) {
    return (
    <div className={`contact-card ${properties.selected ? "selected" : ""}`}>
        <div className = "contact-info">
            {properties.contact.username}
        </div>
    </div>);
}

export default DisplayContactCard;