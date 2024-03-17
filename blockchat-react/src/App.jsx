import React, { useEffect, useState } from "react";
import { SideNav, TopNav, ContactCardContainer, MessageContainer } from "./react-components/react-components.jsx";
import { abi } from "./abi";
import { ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import './App.css';

function App() {

    //Data Structures
    const CONTRACT_ADDRESS = "0x2743383DCEAA71C324fcB7375a037a56E7EDEB44"
    let activeChats = [];
    //=====================================================================================================
    //Hooks
    const [contract, setContract] = useState(null);
    const [username, setUsername] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [activeChat, setActiveChat] = useState({ username: null, walletAddress: null });
    const [currentMessages, setCurrentMessages] = useState(null);
    //=====================================================================================================
    //Functions
    //Connecting to user's MetaMask wallet to identify them.
    //Returns TRUE if successful, FALSE if not.
    async function connectToWallet() {
        //Opens a window to sign-in to MetaMask. This is a promise that will either succeed, and follow the
        //then branch, or fail, and follow the catch branch. 
        try {

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let walletAddress = accounts[0];

            setWalletAddress(walletAddress);
            return walletAddress;

        } catch(error) {

            return false;
        }
    }

    //If the user has connected their MetaMask wallet, tries to login to the associated BlockChat account. If one does
    //not exist, the user is prompted to create one.
    async function blockchatLogin() {

        let walletAddress = await connectToWallet();

        //In JS, variables that have value are considered Truthy so this is entered if an address is found.
        if (walletAddress) {

            const provider = new Web3Provider( window.ethereum );
            const signer = provider.getSigner();
            const tmpContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
            setContract(tmpContract);

            let username;
            const isUser = await tmpContract.isUser(walletAddress);

            if (isUser) {
                username = await tmpContract.getUser(walletAddress);

            } else {

                username = prompt("You do not have an account. Please enter a username to create one.");

                if (username === "") {
                    username = "newUser";
                }

                await tmpContract.createUser(username);
            }

            setUsername(username);

        } else {

            alert("Failed to login.");

        }
        
    }

    function selectChat(username, walletAddress) {
        console.log(username, walletAddress);
        setActiveChat({username, walletAddress});
    }

    async function sendMessage(walletAddress, message) {
        try {
            await contract.sendMessage(walletAddress, message);
        } catch (error) {
            console.log(walletAddress, message);
        }
    }

    async function addContact(walletAddress, nickname) {
        try {
            await contract.addContact(walletAddress, nickname)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        async function loadContacts() {

            let tmpContacts = [];

            try {

                const wrappedContacts = await contract.getContacts()

                wrappedContacts.forEach( ( item ) => {
                    tmpContacts.push({ "username": item[0], "walletAddress": item[1] });
                })

            } catch (error) {
                tmpContacts = null;
            }

            setContacts(tmpContacts);
        }

        loadContacts();

    }, [walletAddress, contract]);

    useEffect(() => {

        console.log("active chat changed.")

        async function loadMessages() {

            let tmpMessages = [];

            try {

                const wrappedMessages = await contract.receiveMessage(activeChat.walletAddress);
                wrappedMessages.forEach( ( message ) => {
                    tmpMessages.push({ "walletAddress": message[0], "timestamp": message[1], "content": message[2] });
                })

            } catch (error) {
                console.log("errored:", error);
                tmpMessages = null;
            }

            setCurrentMessages(tmpMessages);

        }
        loadMessages();

    }, [activeChat]);

    return (
        <div className="app">
                <TopNav 
                    
                />
            <div className ="content">
                <SideNav
                    blockchatLogin={blockchatLogin}
                />
                <ContactCardContainer
                    contacts={contacts}
                    //Needs doing
                    activeChat={activeChat}
                    selectChat={selectChat}
                    addContact = {addContact}
                />
                <MessageContainer 
                    messages = {currentMessages}
                    username = {activeChat.username}
                    myAddress = {walletAddress}
                    contactAddress = {activeChat.walletAddress}
                    sendMessage = {sendMessage}
                />
            </div>
        </div>
    );
}

export default App;