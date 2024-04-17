import React from 'react';
import DisplayContactCard from './DisplayContactCard';
import "./ContactCardContainer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';


function ContactCardContainer (properties) {

    const bgColour = properties.isDarkMode ? "#000000" : "#ffffff"
    const txtColour = properties.isDarkMode ? "#ffffff" : "#000000"
    const frameColour = properties.isDarkMode ? "3px solid #bdbdbd" : "3px solid #444444"

    return (
        <div
            className="contact-container"
            style={{backgroundColor: bgColour, color: txtColour, borderRight: frameColour}}
            >
            <div
                className="contact-header"
                style={{borderBottom: frameColour}}
                >
                    <h2>Contacts</h2>
                    <button
                        onClick={() => {properties.openAddContact()}}
                        data-tooltip-id="add-contact-tooltip"
                        data-tooltip-content={"Add Contact"}>
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{color: txtColour}}
                                size='lg'
                            />
                    </button>
                    <Tooltip id="add-contact-tooltip"/>
            </div>
            <div className="contact-list"> {
                properties.contacts ? (
                properties.contacts.map((contact, index) => (
                    <DisplayContactCard
                        key = {index}
                        contact = {contact}
                        selected = {properties.activeChat && properties.activeChat.username === contact.username}
                        onClick = {() => {properties.selectChat(contact.username, contact.walletAddress, contact.publicEncKey)}}
                        isDarkMode = {properties.isDarkMode}
                    />
                ))) : (<p>You have no contacts.</p>)}
            </div>
        </div>
    );
}

export default ContactCardContainer;