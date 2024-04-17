import React from "react";
import "./LoginBubble.css"

function LoginBubble(properties){

  const bgColour = properties.isDarkMode ? "#000000" : "#ffffff"
  const txtColour = properties.isDarkMode ? "#ffffff" : "#000000"
  const frameColour = properties.isDarkMode ? "#bdbdbd" : "#444444"

  return (
    <div
      className="login-bubble"
      style={{backgroundColor: bgColour, color: txtColour}}
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