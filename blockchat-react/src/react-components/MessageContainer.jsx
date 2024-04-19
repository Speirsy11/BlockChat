import React from 'react';
import { useState } from "react";
import "./MessageContainer.css";
import MessageCard from './MessageCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ethereumLogo from "./ethereumlogo.png"
import invertedEthereumLogo from "./invertedethereumlogo.png"
import { Tooltip } from 'react-tooltip';

/**
 * @component
 * @param {*} properties 
 * @description Child component representing the message portion of the site.
 */
function MessageContainer (properties) {

    /** 
     * @type {string}
     * @description The user's input into the send message box.
     */
    const [inputContent, setInputContent] = useState("");

    /**
     * @description These are colour inversions to enable dark mode if the user has chosen that.
    */
    const bgColour = properties.isDarkMode ? "#000000" : "#ffffff"
    const txtColour = properties.isDarkMode ? "#ffffff" : "#000000"
    const frameColour = properties.isDarkMode ? "3px solid #bdbdbd" : "3px solid #444444"

    /**
     * @description These are the colours that message bubbles will have in light/dark mode.
    */
    const theirColour = properties.isDarkMode ? "#117010" : "#90EE90"
    const myColour = properties.isDarkMode ? "#104170" : "#ADD8E6"

    /**
     * @param {*} event
     * @description Makes sure the text typed into the input bar is displayed.
     */
    function handleInputChange(event) {
        setInputContent(event.target.value);
    };

    /**
     * @type {boolean}
     * @description Boolean value that changes after initiaL connection to site.
     */
    let notFirstTime;
    if (properties.username === null) {
        notFirstTime = false;
    } else {
        notFirstTime = true;
    }

    /**
     * @description Formats the site with certain borders around items if it is not the first load.
     */
    let border = notFirstTime ? "first" : "not"
    if(border === "first") {
        border = frameColour
    } else {
        border = null
    }

    /**
     * @description Here the react components are loaded. They are loaded to display al null rather than themselves until a user is logged in.
     */
    return (
        <div className = "messages-container">
            <div
                className="messages-header"
                style={{backgroundColor: bgColour, color: txtColour, borderBottom: frameColour}}
            >
                <div className="title">
                    <h2>{properties.username ? properties.username : "Messages"}</h2>
                </div>
                <div className="ethereum-logo">
                    {notFirstTime ?
                        <button
                            onClick={() => {properties.openSendETH()}}
                            data-tooltip-id="send-eth-tooltip"
                            data-tooltip-content={"Send ETH to contact"}
                        >
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
                style={{backgroundColor: bgColour, color: txtColour}}
            >
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
                style={{borderTop: border, backgroundColor: bgColour}}
            >
                {notFirstTime ?
                    <input
                        type="text"
                        placeholder="Type your message here..."
                        value={inputContent}
                        onChange={handleInputChange}
                    />
                : null}
                {notFirstTime ?
                    <button
                        onClick={() => {
                            properties.sendMessage(properties.contactAddress, inputContent, properties.publicEncKey);
                            setInputContent("");
                        }}
                        data-tooltip-id="send-message-tooltip"
                        data-tooltip-content={"Send Message"}
                    >
                    <FontAwesomeIcon icon={faPaperPlane} style={{color: txtColour, width: "20px", height: "auto"}}/>
                    </button>
                : null}
                {notFirstTime ? <Tooltip id="send-message-tooltip"/> : null}
            </div>
        </div>
    );
}


/**
 * @param {string} message 
 * @param {*} properties
 * @description Works out whether the message inputted was sent by the user or by a contact to apply styling.
 * @returns {boolean}
 */
function amISender(message, properties) {
    message.walletAddress = message.walletAddress.toLowerCase();
    if (message.walletAddress == properties.myAddress) {
        return true;
    } else {
        return false;
    }
}



export default MessageContainer;