import React, { useState } from 'react';
import Modal from "react-modal";
import "./SendETHModal.css"
/**
 * @component
 * @param {*} properties 
 * @description Modal component representing the send ETH pop up.
 */
function SendETHModal(properties) {

    /**
     * @description These are colour inversions to enable dark mode if the user has chosen that.
     */
    const bgColour = properties.isDarkMode ? "#000000" : "#ffffff"
    const txtColour = properties.isDarkMode ? "#ffffff" : "#000000"
    const frameColour = properties.isDarkMode ? "3px solid #ffffff" : "1px solid #000000"

    /**
     * @type {string}
     * @description The user's amount of ETH to send input.
     */
    const [numberInput, setNumberInput] = useState("");

    /**
     * @description Submits the typed amount of ETH to be sent to the smart contract in main App.jsx.
     * @returns {void}
     */
    function submitDetails() {
        if(numberInput !== "") {
            properties.sendETH(properties.myWalletAddress, properties.theirWalletAddress, numberInput);
        }
        else {
            alert("Please enter valid information.");
        }
    }

    /**
     * @type {string}
     * @description The padding given to the modal, loaded conditionally depending on if it is open.
     */
    const modalPadding = properties.isOpen ? "20px" : "0"

    return (
        <div
            className="modal-container"
        >
            <Modal
                isOpen = {properties.isOpen}
                onRequestClose={properties.onRequestClose}
                contentLabel="Send ETH"
                className={"modal-container"}
                style={{content: {
                    padding: modalPadding, backgroundColor: bgColour, color: txtColour, borderRadius:"15px"
                }}}
            >
                <div
                    className="send-eth-header"
                >
                    <h3>
                        How much ETH would you like to send?
                    </h3>
                </div>
                <div
                    className="content"
                >
                    <input
                        type="text"
                        value={numberInput}
                        onChange={(e) => setNumberInput(e.target.value)}
                        placeholder="ETH Amount"
                    />
                    <button
                        onClick={() => submitDetails(properties)}
                        style={{color: txtColour, border: frameColour, borderRadius:"15px"}}
                    >
                        Send
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default SendETHModal;