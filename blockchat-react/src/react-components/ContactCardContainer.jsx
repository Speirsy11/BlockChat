import React from 'react';
import DisplayContactCard from './DisplayContactCard';
import "./ContactCardContainer.css"

function ContactCardContainer (properties) {
    return (
        <div className="contact-container">
            <h2>
                Contacts
            </h2>
            <div className="contact-list"> {
                properties.contacts ? (
                properties.contacts.map((contact, index) => (
                    <DisplayContactCard
                    key = {index}
                    contact = {contact}
                    selected= {properties.activeChat && properties.activeChat.name === contact.name}
                    //onClick = {properties.selectChat}
                    />
                ))) : (<p>You have no contacts.</p>)}
            </div>
        </div>
    );
}

export default ContactCardContainer;