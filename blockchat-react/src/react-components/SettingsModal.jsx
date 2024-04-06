import Modal from "react-modal";
import React, { useState } from 'react';
import "./SettingsModal.css";

function SettingsModal(properties) {

    const [isDarkMode, setDarkMode] = useState(properties.isDarkMode);

    return (
        <div
            className="container"
        >
            <Modal
                isOpen = {properties.isOpen}
                onRequestClose={properties.onRequestClose}
                contentLabel="Settings"
            >
                <div
                    className="header"
                >
                    <h2>
                        Settings
                    </h2>
                </div>
                <div
                    className="content"
                >
                    <button
                        onClick={() => {}}
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
            </Modal>
        </div>
    );

}

export default SettingsModal;