import React from "react";
import './MessageCard.css';

/**
 * @component
 * @param {*} properties 
 * @description Child component displaying the actual message content.
 */
function MessageCard(properties) {

    /**
    * @type {Object}
    * @description Styling to be applied to each message based on who sent it.
    */
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

/**
 * @param {int} timestamp
 * @description This function takes a Unix timestamp and converts it into a human readable date/time.
 * @returns {string}
 */
function timestampConversion(timestamp) {
  const dateObj = new Date(Number(timestamp) * 1000);
  let hours = String(dateObj.getHours());
  let minutes = String(dateObj.getMinutes());
  let day = String(dateObj.getDate());
  let month = String(dateObj.getMonth() + 1);
  let year = String(dateObj.getFullYear());
  year = year.slice(-2)

  if (hours.length === 1) {
    hours = "0"+hours;
  }
  if (minutes.length === 1) {
    minutes = "0"+minutes;
  }
  const new_timestamp = (day+"/"+month+"/"+year+" - "+hours+":"+minutes);
  return new_timestamp;
}

export default MessageCard;