import React from 'react';
import "./MessageContainer.css";
import MessageCard from './MessageCard';

function MessageContainer (properties) {
    return (
        <div className = "message-container">
            <h2>
                {console.log("updating")}
                {properties.username ? properties.username : ""}
            </h2>
            <div className="message-list"> {
                properties.messages ? (
                properties.messages.map((message, index) => (
                    <MessageCard 
                        key = {index}
                        contactName = {message.contactName}
                        content = {message.content}
                        timestamp = {message.timestamp}
                    />
                ))) : (<p>You have no previous messages.</p>)}
            </div>
        </div>
    );
}

export default MessageContainer;