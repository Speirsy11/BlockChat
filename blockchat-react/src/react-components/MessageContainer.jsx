import React from 'react';
import { useState } from "react";
import "./MessageContainer.css";
import MessageCard from './MessageCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ethereumLogo from "./ethereumlogo.png"
import invertedEthereumLogo from "./invertedethereumlogo.png"
import { Tooltip } from 'react-tooltip';

function MessageContainer (properties) {
    
    const [inputContent, setInputContent] = useState("");

    const bgColour = properties.isDarkMode ? "#000000" : "#ffffff"
    const txtColour = properties.isDarkMode ? "#ffffff" : "#000000"
    const frameColour = properties.isDarkMode ? "3px solid #bdbdbd" : "3px solid #444444"

    const theirColour = properties.isDarkMode ? "#117010" : "#90EE90"
    const myColour = properties.isDarkMode ? "#104170" : "#ADD8E6"

    const handleInputChange = (event) => {
        setInputContent(event.target.value);
      };

    let notFirstTime;
    if (properties.username === null) {
        notFirstTime = false;
    } else {
        notFirstTime = true;
    }

    let border = notFirstTime ? "first" : "not"
    if(border === "first") {
        border = frameColour
    } else {
        border = null
    }

    return (
        <div className = "messages-container">
            <div
            className="messages-header"
            style={{backgroundColor: bgColour, color: txtColour, borderBottom: frameColour}}>
                <div className="title">
                    <h2>{properties.username ? properties.username : "Messages"}</h2>
                </div>
                <div className="ethereum-logo">
                    {notFirstTime ? <button
                        onClick={() => {properties.openSendETH()}}
                        data-tooltip-id="send-eth-tooltip"
                        data-tooltip-content={"Send ETH to contact"}>
                        <img
                            src = {properties.isDarkMode ? invertedEthereumLogo : ethereumLogo}
                            alt="Ethereum Logo"
                            className="ethereum-logo"
                        />
                        </button> : null}
                    {notFirstTime ? <Tooltip id="send-eth-tooltip"/> : null}
                </div>
            </div>
            <div
                className="messages-list-container"
                style={{backgroundColor: bgColour, color: txtColour}}>
                <div className="messages-list"> {
                    properties.messages ? (
                    properties.messages.map((message, index) => {

                        let sender, colour, side;

                        if(amISender(message, properties)) {
                            sender = "You";
                            colour = myColour
                            side = "right"
                        } else {
                            sender = properties.username;
                            colour = theirColour
                            side = "left"
                        }

                        return (
                        <MessageCard 
                            key = {index}
                            contactName = {properties.username}
                            content = {message.content}
                            timestamp = {message.timestamp}
                            sender = {sender}
                            colour = {colour}
                            side = {side}
                        />
                    )})) : (<p>Select a contact to chat with.</p>)}
                </div>
            </div>
            <div
                className="input-container"
                style={{borderTop: border, backgroundColor: bgColour}}>
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
                    <FontAwesomeIcon icon={faPaperPlane} style={{color: txtColour, width: "20px", height: "auto"}}/>
                </button> : null}
                {notFirstTime ? <Tooltip id="send-message-tooltip"/> : null}
            </div>
        </div>
    );
}

function amISender(message, properties) {
    message.walletAddress = message.walletAddress.toLowerCase();
    console.log("Mine:", properties.myAddress, "Message:", message.walletAddress)
    if (message.walletAddress == properties.myAddress) {
        return true;
    } else {
        return false;
    }
}



export default MessageContainer;