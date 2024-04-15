import React from 'react';
import { useState } from "react";
import "./MessageContainer.css";
import MessageCard from './MessageCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ethereumLogo from "./ethereumlogo.png"
import { Tooltip } from 'react-tooltip';

function MessageContainer (properties) {
    
    const [inputContent, setInputContent] = useState("");

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
            <div className="messages-header">
                <div className="title">
                    <h2>{properties.username ? properties.username : "Messages"}</h2>
                </div>
                <div className="ethereum-logo">
                    {notFirstTime ? <button
                        onClick={() => {properties.openSendETH()}}
                        data-tooltip-id="send-eth-tooltip"
                        data-tooltip-content={"Send ETH to contact"}>
                        <img
                            src = {ethereumLogo}
                            alt="Ethereum Logo"
                            className="ethereum-logo"
                        />
                        </button> : null}
                    {notFirstTime ? <Tooltip id="send-eth-tooltip"/> : null}
                </div>
            </div>
            <div className="message-list"> {
                properties.messages ? (
                properties.messages.map((message, index) => {

                    let sender, colour;

                    if(amISender(message, properties)) {
                        sender = "You";
                        colour = "#ADD8E6"
                    } else {
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
                    onClick={() => {
                        properties.sendMessage(properties.contactAddress, inputContent, properties.publicEncKey);
                        setInputContent("");
                        }}
                    data-tooltip-id="send-message-tooltip"
                    data-tooltip-content={"Send Message"}>
                    <FontAwesomeIcon icon={faPaperPlane} style={{color: "#444444", width: "20px", height: "auto"}}/>
                </button> : null}
                {notFirstTime ? <Tooltip id="send-message-tooltip"/> : null}
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