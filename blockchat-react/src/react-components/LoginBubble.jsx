import React from "react";
import "./LoginBubble.css"

/**
 * @component
 * @param {*} properties 
 * @description Simple bubble that displays a user's username if they are logged in, or "Logged out." if they are not.
 */
function LoginBubble(properties){

  /**
   * @description These are colour inversions to enable dark mode if the user has chosen that.
   */
  const bgColour = properties.isDarkMode ? "#000000" : "#ffffff"
  const txtColour = properties.isDarkMode ? "#ffffff" : "#000000"

  return (
    <div
      className="login-bubble"
      style={{ backgroundColor: bgColour, color: txtColour }}
    >
      {properties.username ? (
        <div className="logged-in">
          {properties.username}
        </div>
      ) : (
        <div className="logged-out">
          Logged out.
        </div>
      )}
    </div>
  );

};

export default LoginBubble;