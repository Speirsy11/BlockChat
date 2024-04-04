import React, { useState } from 'react';
import Modal from "react-modal";
import "./AddContactModal.css"

function AddContactModal(properties) {

    const [nameInput, setNameInput] = useState("");
    const [walletInput, setWalletInput] = useState("");

    function submitDetails() {
        if(walletInput !== "") {
            properties.addContact(walletInput, nameInput);
        }
        else {
            alert("Please enter valid information.");
        }
    }

    return (
        <div
            className="container"
        >
            <Modal
                isOpen = {properties.isOpen}
                onRequestClose={properties.onRequestClose}
                contentLabel="Add Contact"
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
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Contact Name"
                    />
                    <input
                        type="text"
                        value={walletInput}
                        onChange={(e) => setWalletInput(e.target.value)}
                        placeholder="Contact Wallet Address"
                    />
                    <button
                        onClick={() => submitDetails(properties)}
                        style={{color: 'black', border: "1px solid black", borderRadius:"15px"}}
                    >
                        Submit
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default AddContactModal;