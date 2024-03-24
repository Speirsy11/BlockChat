import React from 'react';
import { useState } from "react";
import "./MessageContainer.css";
import MessageCard from './MessageCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function MessageContainer (properties) {
    
    const [inputContent, setInputContent] = useState('');

    const handleInputChange = (event) => {
        setInputContent(event.target.value);
      };

    let notFirstTime;
    if (properties.username === null) {
        notFirstTime = false;
    } else {
        notFirstTime = true;
    }

    return (
        <div className = "message-container">
            <div className="title">
                <h2>{properties.username ? properties.username : "Messages"}</h2>
            </div>
            <div className="message-list"> {
                properties.messages ? (
                properties.messages.map((message, index) => {

                    let sender, colour;

                    if(amISender(message, properties)) {

                        console.log("you");
                        sender = "You";
                        colour = "#ADD8E6"
                    } else {
                        console.log("username");
                        sender = properties.username;
                        colour = "#90EE90"
                    }

                    return (
                    <MessageCard 
                        key = {index}
                        contactName = {properties.username}
                        content = {message.content}
                        timestamp = {message.timestamp}
                        sender = {sender}
                        colour = {colour}
                    />
                )})) : (<p>You have no previous messages.</p>)}
            </div>
            <div className="input-container">

                {notFirstTime ? <input
                    type="text"
                    placeholder="Type your message here..."
                    value={inputContent}
                    onChange={handleInputChange}
                    /> : null}

                {notFirstTime ? <button
                    onClick={() => {properties.sendMessage(properties.contactAddress, inputContent)}}>
                    <FontAwesomeIcon icon={faPaperPlane} style={{color: "#444444"}}/>
                </button> : null}
            </div>
        </div>
    );
}

function amISender(message, properties) {
    message.walletAddress = message.walletAddress.toLowerCase();
    if (message.walletAddress === properties.myAddress) {
        return true;
    } else {
        return false;
    }
}

export default MessageContainer;