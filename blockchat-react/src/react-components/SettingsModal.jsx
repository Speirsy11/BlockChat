import Modal from "react-modal";
import React, { useEffect, useState } from 'react';
import "./SettingsModal.css";

function SettingsModal(properties) {

    const [isDarkMode, setDarkMode] = useState(properties.isDarkMode);
    const [changingUsername, setChangingUsername] = useState(false);
    const [userInput, setUserInput] = useState("");

    let open = false;
    open = open ? false : true;

    let currentModal = (<Modal
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
                onClick={() => {setChangingUsername(open)}}
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
    </Modal>);;

    function submitDetails() {
        if(userInput !== "") {
            properties.changeUsername(userInput);
        }
        else {
            alert("Please enter valid information.");
        }
    }

    useEffect(() => {

        console.log("entered");

        function switchUI() {
            console.log(changingUsername);
            if (!changingUsername) {
                currentModal = (<Modal
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
                            onClick={() => {setChangingUsername(open)}}
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
            }
            else {
                console.log("should change");
                currentModal = ( <Modal
                    isOpen = {properties.isOpen}
                    onRequestClose={properties.onRequestClose}
                    contentLabel="Settings"
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
            }
        }
        switchUI();

    }, [changingUsername]);

    return (
        <div className="container">
           {currentModal}
        </div>
    );

}

export default SettingsModal;