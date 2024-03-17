import React from "react";
import './MessageCard.css';

function MessageCard(properties) {
    return (
      <div className="message-card"
      style={{background: properties.colour}}>
        <div className="header-info">
          <h3>{properties.sender}</h3>
          <h3>{timestampConversion(properties.timestamp)}</h3>
        </div>
        <div className="message">
          <p>{properties.content}</p>
        </div>
      </div>
    );
  }

function timestampConversion(timestamp) {
  const dateObj = new Date(Number(timestamp) * 1000);
  let hours = String(dateObj.getHours());
  let minutes = String(dateObj.getMinutes());

  if (hours.length === 1) {
    hours = "0"+hours;
  }
  if (minutes.length === 1) {
    minutes = "0"+minutes;
  }
  const new_timestamp = (hours+":"+minutes);
  return new_timestamp;
}

export default MessageCard;