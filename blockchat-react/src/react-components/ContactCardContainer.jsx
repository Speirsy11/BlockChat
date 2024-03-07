import React from 'react';
import DisplayContactCard from './DisplayContactCard';

function ContactCardContainer (properties) {
    return (
        <div className="contact-container">
            <h2>
                Contacts
            </h2>
            <div className="contact-list">
                console.log(properties.contacts);
                {
                    properties.contacts.map((contact, index) => (
                        <DisplayContactCard
                        key = {index}
                        contact = {contact}
                        selected= {properties.activeChat && properties.activeChat.name === contact.name}
                        //onClick = {properties.selectChat}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default ContactCardContainer;