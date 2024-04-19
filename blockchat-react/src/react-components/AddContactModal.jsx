import React, { useState } from 'react';
import Modal from "react-modal";
import "./AddContactModal.css"

/**
 * @component
 * @param {*} properties 
 * @description Modal component representing the add contact pop up.
 */
function AddContactModal(properties) {

    /**
     * @description These are colour inversions to enable dark mode if the user has chosen that.
     */
    const bgColour = properties.isDarkMode ? "#000000" : "#ffffff"
    const txtColour = properties.isDarkMode ? "#ffffff" : "#000000"
    const frameColour = properties.isDarkMode ? "3px solid #ffffff" : "1px solid #000000"

    /**
     * @type {string}
     * @description The user's wallet address input.
     */
    const [walletInput, setWalletInput] = useState("");

    /**
     * @description Submits the typed wallet address to be sent to the smart contract in main App.jsx.
     * @returns {void}
     */
    function submitDetails() {
        if(walletInput !== "") {
            properties.addContact(walletInput);
            properties.onRequestClose();
        }
        else {
            alert("Please enter valid information.");
        }
    }

    /**
     * @type {string}
     * @description The padding given to the modal, loaded conditionally depending on if it is open.
     */
    const modalPadding = properties.isOpen ? "20px" : "0";

    return (
        <div
            className="modal-container"
        >
            <Modal
                isOpen = {properties.isOpen}
                onRequestClose={properties.onRequestClose}
                contentLabel="Add Contact"
                className={"modal-container"}
                style={{content: {
                    padding: modalPadding, backgroundColor: bgColour, color: txtColour, borderRadius:"15px"
                }}}
            >
                <div
                    className="header"
                >
                    <h2>
                        Add New Contact
                    </h2>
                </div>
                <div
                    className="content"
                >
                    <input
                        type="text"
                        value={walletInput}
                        onChange={(e) => setWalletInput(e.target.value)}
                        placeholder="Contact Wallet Address"
                    />
                    <button
                        onClick={() => submitDetails(properties)}
                        style={{color: txtColour, border: frameColour, borderRadius:"15px"}}
                    >
                        Submit
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default AddContactModal;