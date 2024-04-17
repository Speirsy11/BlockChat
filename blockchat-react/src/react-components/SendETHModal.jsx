import React, { useState } from 'react';
import Modal from "react-modal";
import "./SendETHModal.css"

function SendETHModal(properties) {

    const [numberInput, setNumberInput] = useState("");

    function submitDetails() {
        if(numberInput !== "") {
            properties.sendETH(properties.myWalletAddress, properties.theirWalletAddress, numberInput);
        }
        else {
            alert("Please enter valid information.");
        }
    }

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
                    padding: modalPadding
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
                        style={{color: 'black', border: "1px solid black", borderRadius:"15px"}}
                    >
                        Send
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default SendETHModal;