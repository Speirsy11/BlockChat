import React from 'react';
import DisplayContactCard from './DisplayContactCard';
import "./ContactCardContainer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function ContactCardContainer (properties) {

    return (
        <div className="contact-container">
            <div className="header">
                <h2>Contacts</h2>
                <div className="button-container">
                    <button onClick={properties.addContact}>
                        <FontAwesomeIcon
                            icon={faPlus}
                            style={{color: "#444444"}}
                            //Add popup to input username plus address.
                            onClick={properties.addContact()}
                        />
                    </button>
                </div>
            </div>
            <div className="contact-list"> {
                properties.contacts ? (
                properties.contacts.map((contact, index) => (
                    <DisplayContactCard
                    key = {index}
                    contact = {contact}
                    selected= {properties.activeChat && properties.activeChat.username === contact.username}
                    onClick = {() => {
                        console.log("clicked");
                        console.log(contact.username, contact.walletAddress);
                        properties.selectChat(contact.username, contact.walletAddress)}}
                    />
                ))) : (<p>You have no contacts.</p>)}
            </div>
        </div>
    );
}

export default ContactCardContainer;