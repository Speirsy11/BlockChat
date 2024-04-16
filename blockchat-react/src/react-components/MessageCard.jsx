import React from "react";
import './MessageCard.css';

function MessageCard(properties) {

  console.log(properties.side)

    const messageStyling = {
      background: properties.colour,
      float: properties.side
    }

    return (
      <div className="message-card"
      style={messageStyling}>
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
  let day = String(dateObj.getDate());
  let month = String(dateObj.getMonth() + 1);
  let year = String(dateObj.getFullYear());
  year = year.slice(-2)
  console.log(day, month, year)

  if (hours.length === 1) {
    hours = "0"+hours;
  }
  if (minutes.length === 1) {
    minutes = "0"+minutes;
  }
  const new_timestamp = (day+"/"+month+"/"+year+" - "+hours+":"+minutes);
  console.log(new_timestamp)
  return new_timestamp;
}

export default MessageCard;