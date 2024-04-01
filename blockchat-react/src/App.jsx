import React, { useEffect, useState } from "react";
import { SideNav, TopNav, ContactCardContainer, MessageContainer, AddContactModal } from "./react-components/react-components.jsx";
import { abi } from "./abi";
import { ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import Web3 from "web3";
import nacl from "tweetnacl";
import naclUtil from 'tweetnacl-util';
import './App.css';

function App() {

    //Data Structures
    const CONTRACT_ADDRESS = "0x634D630BcBA58173184f9B54f7B2b1EE22604abD"
    //=====================================================================================================
    //Hooks
    const [contract, setContract] = useState(null);
    const [username, setUsername] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [myWalletAddress, setMyWalletAddress] = useState(null);
    const [activeChat, setActiveChat] = useState({ username: null, walletAddress: null });
    const [currentMessages, setCurrentMessages] = useState(null);
    const [isAddContactOpen, setAddContactOpen] = useState(false);
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

            setMyWalletAddress(walletAddress);
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

            const provider = new Web3Provider(window.ethereum);
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

                let keys = nacl.box.keyPair();
                let publicEncKey = keys.publicKey;

                const databasePromise = window.indexedDB.open("Site Storage", 1);
                databasePromise.onsuccess = function(event) {
                    console.log("Opened DB");

                    let database = event.target.result;
                    let transaction = database.transaction("KeyStorage", "readwrite");
                    let store = transaction.objectStore("KeyStorage");
                
                    let data = {
                        walletAddress: walletAddress,
                        privateKey: keys.secretKey
                    }

                    console.log(data);

                    store.put(data);

                    transaction.oncomplete = function() {
                        console.log("stored in db");
                        database.close();
                    };
                };

                await tmpContract.createUser(username, publicEncKey);
            }

            setUsername(username);
            alert("Connected to BlockChat account.");

        } else {

            alert("Failed to login.");

        }
        
    }

    function selectChat(username, walletAddress) {
        console.log(username, walletAddress);
        setActiveChat({username, walletAddress});
    }

    async function sendMessage(walletAddress, message) {
        let secretKey, encryptedMessage, request2;
        try {
            const databasePromise =  new Promise((resolve, reject) => {
                const openRequest = window.indexedDB.open("Site Storage", 1);

                openRequest.onsuccess = function(event) {
                    let database = event.target.result;
                    let transaction = database.transaction("KeyStorage", "readonly");
                    let store = transaction.objectStore("KeyStorage");

                    request2 = store.getAllKeys();
                
                    let request = store.get(myWalletAddress);
                
                    request.onsuccess = function() {
                        console.log("req Success", request, request.result)
                        secretKey = request.result;
                        resolve(secretKey);
                    };
                
                    request.onerror = function() {
                        reject(new Error("KeyPair not found."))
                    };
                };
            });

                secretKey = await databasePromise;

                let nonce = nacl.randomBytes(nacl.box.nonceLength);

                message = naclUtil.decodeUTF8(message);
                //nonce = naclUtil.decodeUTF8(nonce);
                console.log(walletAddress);
                walletAddress = naclUtil.decodeUTF8(walletAddress);
                console.log(secretKey);
                secretKey = naclUtil.decodeUTF8(secretKey);

                encryptedMessage = nacl.box(message, nonce, walletAddress, secretKey)

                await contract.sendMessage(walletAddress, encryptedMessage, nonce);
        } catch (error) {
            console.log("ALL:", request2.result);
            console.log(error);
            console.log(walletAddress, message, encryptedMessage);
        }
    }

    async function addContact(walletAddress, nickname) {
        try {
            await contract.addContact(walletAddress)
        } catch (error) {
            //Do Nothing
            console.log(error)
        }
    }

    function openAddContact() {
        setAddContactOpen(true);
        console.log("clicked.")
    }

    function closeAddContact() {
        setAddContactOpen(false);
    }

    async function handleAccountChanged() {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            setMyWalletAddress(null);
        }
        else {
            const tmpWalletAddress = accounts[0];
            setMyWalletAddress(tmpWalletAddress);
        }
    }

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

        try {
            if (tmpContacts.length === 0) {
                tmpContacts = null;
            }
        } catch {
            //Do Nothing
        }

        setContacts(tmpContacts);
    }

    useEffect(() => {

        async function initialSetup() {
            if(window.ethereum) {
                window.ethereum.on('accountsChanged', handleAccountChanged);
            }
            else {
                alert("MetaMask is not installed.");
            }

            if (window.indexedDB) {
                console.log("Initial Setup");
                const databasePromise = window.indexedDB.open("Site Storage", 1);

                databasePromise.onupgradeneeded = function(event) {
                    console.log("DB Upgraded");
                    let database = event.target.result;
                    database.createObjectStore("KeyStorage", {keyPath: "walletAddress"});
                    database.close();
                };
            }
            else {
                alert("Your browser does not support indexedDB.");
            }
        }

        initialSetup();
    }, []);

    useEffect(() => {

    loadContacts();

    }, [myWalletAddress, contract]);

    useEffect(() => {

        loadMessages();

    }, [activeChat]);

    return (
        <div className="app">
                <TopNav 
                    loadMessages={loadMessages}
                    loadContacts={loadContacts}
                />
                <AddContactModal
                    isOpen={isAddContactOpen}
                    onRequestClose={closeAddContact}
                    addContact={addContact}
                    openAddContact={openAddContact}
                />                
            <div className ="content">
                <SideNav
                    blockchatLogin={blockchatLogin}
                    walletAddress={myWalletAddress}
                />
                <ContactCardContainer
                    contacts={contacts}
                    //Needs doing
                    activeChat={activeChat}
                    selectChat={selectChat}
                    openAddContact = {openAddContact}
                />
                <MessageContainer 
                    messages = {currentMessages}
                    username = {activeChat.username}
                    myAddress = {myWalletAddress}
                    contactAddress = {activeChat.walletAddress}
                    sendMessage = {sendMessage}
                />
            </div>
        </div>
    );
}

export default App;