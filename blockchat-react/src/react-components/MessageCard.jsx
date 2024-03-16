import React from "react";
import './MessageCard.css';

function MessageCard(properties) {
    return (
      <div className="message-card">
        <div className="contact-name">{properties.contactName}</div>
        <div className="message">{properties.message}</div>
        <div className="timestamp">{properties.timestamp}</div>
      </div>
    );
  }

export default MessageCard;