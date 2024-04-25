import Modal from "react-modal";
import React, { useState } from 'react';
import "./SettingsModal.css";

/**
 * @component
 * @param {*} properties 
 * @description Modal component representing the settings pop up.
 */
function SettingsModal(properties) {

    /**
     * @description These are colour inversions to enable dark mode if the user has chosen that.
     */
    const bgColour = properties.isDarkMode ? "#000000" : "#ffffff"
    const txtColour = properties.isDarkMode ? "#ffffff" : "#000000"
    const frameColour = properties.isDarkMode ? "3px solid #ffffff" : "1px solid #000000"
    /**
     * @type {string}
     * @description The user's new username input.
     */
    const [userInput, setUserInput] = useState("");

    /**
     * @type {React Component}
     * @description The current modal being displayed to the user.
     */
    const [modal, setModal] = useState(0);


    /**
     * @description Changes the modal that is displayed on close so that it reopens on the original settings.
     * @returns {void}
     */
    function wrappedClose() {
        setModal(0);
        properties.onRequestClose();
    }

    /**
     * @type {string}
     * @description The padding given to the modal, loaded conditionally depending on if it is open.
     */
    const modalPadding = properties.isOpen ? "20px" : "0"

    /**
     * @type {React Component}
     * @description The default settings modal.
     */
    const settingsModal = 
        (<Modal
            isOpen = {properties.isOpen}
            onRequestClose={wrappedClose}
            contentLabel="Settings"
            className={"modal-container"}
            style={{content: {
                padding: modalPadding, backgroundColor: bgColour, color: txtColour, borderRadius:"15px"
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
                    style={{color: txtColour, border: frameColour, borderRadius:"15px"}}
                >
                    Change Username
                </button>
                {properties.isDarkMode ? 
                <button
                    onClick={() => {properties.activateLightMode()}}
                    style={{color: txtColour, border: frameColour, borderRadius:"15px"}}
                >
                    Enter Light Mode
                </button> :
                <button
                    onClick={() => {properties.activateDarkMode()}}
                    style={{color: txtColour, border: frameColour, borderRadius:"15px"}}
                >
                    Enter Dark Mode
                </button>}
            </div>
        </Modal>);

    /**
     * @type {React Component}
     * @description The modal displayed once a user selects change username.
     */
    const inputModal = 
        ( <Modal
            isOpen = {properties.isOpen}
            onRequestClose={wrappedClose}
            contentLabel="Settings"
            className={"modal-container"}
            style={{content: {
                padding: modalPadding, backgroundColor: bgColour, color: txtColour, borderRadius:"15px"
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
                    style={{color: txtColour, border: frameColour, borderRadius:"15px"}}
                >
                    Submit
                </button>
            </div>
        </Modal>);

    /**
     * @description Submits the typed username to be sent to the smart contract in main App.jsx.
     * @returns {void}
     */
    function submitDetails() {
        if(userInput !== "") {
            properties.changeUsername(userInput);
        }
        else {
            alert("Please enter valid information.");
        }
    }

    /**
     * @type {React Component}
     * @description Conditional displaying of both modals.
     */
    const currentModal = modal == 0 ? settingsModal : inputModal;

    return (
        <div className="modal-container">
           {currentModal}
        </div>
    );

}

export default SettingsModal;