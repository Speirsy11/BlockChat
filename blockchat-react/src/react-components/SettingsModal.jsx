import Modal from "react-modal";
import React, { useEffect, useState } from 'react';
import "./SettingsModal.css";

function SettingsModal(properties) {

    const [isDarkMode, setDarkMode] = useState(properties.isDarkMode);
    const [changingUsername, setChangingUsername] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [modal, setModal] = useState(0);

    function wrappedClose() {
        setModal(0);
        properties.onRequestClose();
    }

    const modalPadding = properties.isOpen ? "20px" : "0"

    const settingsModal = 
        (<Modal
            isOpen = {properties.isOpen}
            onRequestClose={wrappedClose}
            contentLabel="Settings"
            className={"modal-container"}
            style={{content: {
                padding: modalPadding
            }}}
        >
            <div
                className="settings-header"
            >
                <h2>
                    Settings
                </h2>
            </div>
            <div
                className="content"
            >
                <button
                    onClick={() => {setModal(1)}}
                    style={{color: 'black', border: "1px solid black", borderRadius:"15px"}}
                >
                    Change Username
                </button>
                <button
                    onClick={() => {}}
                    style={{color: 'black', border: "1px solid black", borderRadius:"15px"}}
                >
                    Enter Dark Mode
                </button>
            </div>
        </Modal>);

    const inputModal = 
        ( <Modal
            isOpen = {properties.isOpen}
            onRequestClose={wrappedClose}
            contentLabel="Settings"
            className={"modal-container"}
            style={{content: {
                padding: modalPadding
            }}}
        >
            <div
                className="header"
            >
                <h2>
                    Change Username
                </h2>
            </div>
            <div
                className="content"
            >
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="New Username"
                />
                <button
                    onClick={() => {submitDetails(userInput)}}
                    style={{color: 'black', border: "1px solid black", borderRadius:"15px"}}
                >
                    Submit
                </button>
            </div>
        </Modal>);

    function submitDetails() {
        if(userInput !== "") {
            properties.changeUsername(userInput);
        }
        else {
            alert("Please enter valid information.");
        }
    }

    const currentModal = modal == 0 ? settingsModal : inputModal;

    return (
        <div className="modal-container">
           {currentModal}
        </div>
    );

}

export default SettingsModal;