import React from "react";
import "./LoginBubble.css"

function LoginBubble(properties){

  return (
    <div className="login-bubble">
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