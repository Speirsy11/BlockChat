import React, { useEffect, useState } from "react";
import { SideNav, TopNav, ContactCardContainer, MessageContainer, AddContactModal, SettingsModal, SendETHModal } from "./react-components/react-components.jsx";
import { abi } from "./abi";
import { ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import Web3 from "web3";
import nacl from "tweetnacl";
import naclUtil from 'tweetnacl-util';
import './App.css';

/**
 * @type {string}
 * @description The BlockChat smart contract address.
 */
const CONTRACT_ADDRESS = "0xE961bf4AAECca5904a887c45301e5E46f1F05eF9";

/**
 * @component
 * @description Main component representing the application.
 */
function App() {

    /** 
     * @type {ethers.Contract | null}
     * @description The BlockChat smart contract.
     */
    const [contract, setContract] = useState(null);

    /**
     * @type {string | null}
     * @description The user's username.
     */
    const [username, setUsername] = useState(null);

    /**
     * @type {Array | null}
     * @description A list of the user's contacts.
     */
    const [contacts, setContacts] = useState(null);

    /**
     * @type {string | null}
     * @description The user's wallet address.
     */
    const [myWalletAddress, setMyWalletAddress] = useState(null);

    /**
     * @type {{ username: string | null, walletAddress: string | null, publicEncKey: string | null}}
     * @description The contact information of whatever chat is selected.
     */
    const [activeChat, setActiveChat] = useState({ username: null, walletAddress: null, publicEncKey: null });

    /**
     * @type {Array | null}
     * @description A list of the messages between the user and the selected contact.
     */
    const [currentMessages, setCurrentMessages] = useState(null);

    /**
     * @type {boolean | false}
     * @description A boolean representing whether the addContact modal is open or not.
     */
    const [isAddContactOpen, setAddContactOpen] = useState(false);

    /**
     * @type {boolean | false}
     * @description A boolean representing whether the settings modal is open or not.
     */
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    /**
     * @type {boolean | false}
     * @description A boolean representing whether the sending ETH modal is open or not.
     */
    const [isSendETHOpen, setSendETHOpen] = useState(false);

    /**
     * @type {boolean | false}
     * @description A boolean representing whether the dark mode is enabled or not.
     */
    const [isDarkMode, setDarkMode] = useState(false);

    /**
     * @type {Uint8Array | null}
     * @description The user's secret key.
     */
    const [secretKey, setSecretKey] = useState(null);

    /**
     * @description Opens a window to sign-in to MetaMask. This is a promise that will either succeed, and follow the then branch, or fail, and follow the catch branch. 
     * @returns {Promise<string | boolean>} A Promise resolving to the wallet address (string) or false (boolean).
     */
    async function connectToWallet() {
        try {

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let walletAddress = accounts[0];

            walletAddress = walletAddress.toLowerCase();
            setMyWalletAddress(walletAddress);
            return walletAddress;

        } catch (error) {

            return false;
        }
    }

    /**
     * @description If the user's wallet is connected, an attempt to login to BlockChat is made. They either sign in to an account, create a new account or fail and are alerted that they have not logged in.
     * Based on this result, a user is assigned a secretKey if they do not have one. It is then saved to the indexedDB.
     * @returns {void}
     */
    async function blockchatLogin() {

        try {

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
                    let tmpSecretKey;
                    username = await tmpContract.getUser(walletAddress);

                    const databasePromise =  new Promise((resolve, reject) => {
                        const openRequest = window.indexedDB.open("Site Storage", 1);
                
                        openRequest.onsuccess = function(event) {
                            let database = event.target.result;
                            let transaction = database.transaction("KeyStorage", "readonly");
                            let store = transaction.objectStore("KeyStorage");
                                
                            let request = store.get(walletAddress);
                                
                            request.onsuccess = function() {
                                tmpSecretKey = request.result.privateKey;
                                resolve(tmpSecretKey);
                            };
                                
                            request.onerror = function() {
                                reject(new Error("KeyPair not found."))
                            }};
                    });
            
                    let secretKey = await databasePromise;

                    setSecretKey(secretKey);

                    alert("Connected to BlockChat account.");

                } else {

                    username = prompt("You do not have an account. Please enter a username to create one.");

                    if (username === "") {
                        username = "newUser";
                    }

                    let keys = nacl.box.keyPair();

                    const databasePromise = window.indexedDB.open("Site Storage", 1);
                    databasePromise.onsuccess = function(event) {

                        let database = event.target.result;
                        let transaction = database.transaction("KeyStorage", "readwrite");
                        let store = transaction.objectStore("KeyStorage");
                    
                        let data = {
                            walletAddress: walletAddress,
                            privateKey: keys.secretKey
                        }

                        setSecretKey(secretKey);

                        store.put(data);

                        transaction.oncomplete = function() {
                            database.close();
                        };
                    };

                    await tmpContract.createUser(username, keys.publicKey);

                }

                setUsername(username);

            } else {

                alert("Failed to login.");

            }

        } catch (error) {
            console.log("ENTERED ERROR:", error);
            alert("Failed to login.");
        } 
    }

    /**
     * @param {string} username - The contact's username.
     * @param {string} walletAddress - The contact's wallet address.
     * @param {string} publicEncKey - The contact's public encryption key.
     * @description This sets the activeChat hook to whichever contact is sent to it.
     * @returns {void}
     */
    function selectChat(username, walletAddress, publicEncKey) {
        if (publicEncKey.startsWith('0x')) {
            publicEncKey = publicEncKey.slice(2);
        }
        setActiveChat({username, walletAddress, publicEncKey});
    }

    /**
     * @param {string} walletAddress - The contact's wallet address.
     * @param {string} username - The contact's username.
     * @param {string} publicEncKey - The contact's public encryption key.
     * @description Firstly reads in the secretKey and then uses this in combination with the input parameters and a randomly generated nonce to encrypt the message into a box. This box is then sent to be stored in the contract.
     * @returns {void}
     */
    async function sendMessage(walletAddress, message, publicEncKey) {
        let secretKey;
        try {
                const databasePromise =  new Promise((resolve, reject) => {
                    const openRequest = window.indexedDB.open("Site Storage", 1);
            
                    openRequest.onsuccess = function(event) {
                        let database = event.target.result;
                        let transaction = database.transaction("KeyStorage", "readonly");
                        let store = transaction.objectStore("KeyStorage");
                            
                        let request = store.get(myWalletAddress);
                            
                        request.onsuccess = function() {
                            secretKey = request.result.privateKey;
                            resolve(secretKey);
                        };
                            
                        request.onerror = function() {
                            reject(new Error("KeyPair not found."))
                        }};
                });
                
                let nonce = nacl.randomBytes(nacl.box.nonceLength);
                secretKey = await databasePromise;
                message = naclUtil.decodeUTF8(message);
                publicEncKey = Web3.utils.hexToBytes(publicEncKey);

                let encryptedMessage = nacl.box(message, nonce, publicEncKey, secretKey);

                await contract.sendMessage(walletAddress, encryptedMessage, nonce);
        } catch (error) {
            console.log("ENTERED ERROR:", error);
        }
    }

    /**
     * @param {string} newUsername - The username that the user wants to switch to.
     * @description Takes a new username and sends it to the contract to switch it for the user.
     * @return {void}
     */
    async function changeUsername(newUsername) {
        try {
            await contract.changeUsername(newUsername);
        } catch (error) {
            console.log("ENTERED ERROR:", error);
            alert("Please login to BlockChat before doing this.")
        }
    }

    /**
     * @param {string} walletAddress - The contact's wallet address.
     * @description Takes a wallet address as an input and tries to add the associated account as a contact. Alerts the user if this fails.
     * @returns {void}
     */
    async function addContact(walletAddress) {

        if (username) {
            try {
                await contract.addContact(walletAddress)
            } catch (error) {
                alert("This is not an address associated with BlockChat, please try again.")
                console.log("ENTERED ERROR:", error);
            }
        } else {
            alert("Please login to BlockChat first.");
        }

    }

    /**
     * @description Opens the add contact modal by setting the react hook.
     * @returns {void}
     */
    function openAddContact() {
        setAddContactOpen(true);
    }

    /**
     * @description Closes the add contact modal by setting the react hook.
     * @returns {void}
     */
    function closeAddContact() {
        setAddContactOpen(false);
    }

    /**
     * @description Opens the settings modal by setting the react hook.
     * @returns {void}
     */
    function openSettings() {
        setSettingsOpen(true);
    }

    /**
     * @description Closes the settings modal by setting the react hook.
     * @returns {void}
     */
    function closeSettings() {
        setSettingsOpen(false);
    }

    /**
     * @description Opens the send ETH modal by setting the react hook.
     * @returns {void}
     */
    function openSendETH() {
        setSendETHOpen(true);
    }

    /**
     * @description Closes the send ETH modal by setting the react hook.
     * @returns {void}
     */
    function closeSendETH() {
        setSendETHOpen(false);
    }

    /**
     * @description Activates dark mode by setting the react hook.
     * @returns {void}
     */
    function activateDarkMode() {
        setDarkMode(true);
    }

    /**
     * @description Deactivates dark mode by setting the react hook.
     * @returns {void}
     */
    function activateLightMode() {
        setDarkMode(false);
    }

    /**
     * @param {string} myWalletAddress - The user's wallet address.
     * @param {string} theirWalletAddress - The contact's wallet address.
     * @param {int} ethValue - The amount of ETH wanting to be sent.
     * @description Sends the specified amount of ETH from the user's wallet to the contact's.
     * @returns {void}
     */
    function sendETH(myWalletAddress, theirWalletAddress, ethValue) {
        const web3 = new Web3(window.ethereum);
        const weiValue = web3.utils.toWei(ethValue, 'ether');

        web3.eth.sendTransaction({
            from: myWalletAddress,
            to: theirWalletAddress,
            value: weiValue,
            gas: 50000
        })
            .on("transactionHash", () => {
                alert("ETH transferred successfully.");
            })
            .catch((error) => {
                console.log("Transaction error:", error);
                alert("You can not afford this transaction.");
            });
    }

    /**
     * @description Updates the webapp with who is connected whenever an account is switched. This also handles disconnection from the webapp by setting the react hook.
     * @returns {void}
     */
    async function handleAccountChanged() {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {

            setUsername(null);
            setMyWalletAddress(null);

        }
        else {
            const tmpWalletAddress = accounts[0];
            setMyWalletAddress(tmpWalletAddress);
        }
    }
 
    /**
     * @description Attempts to read the messages between the user and the selected contact. If successful, the messages are decrypted and turned into message objects for the program. These message objects are stored
     * as the current messages through the react hook.
     * @returns {void}
     */
    async function loadMessages() {

        let tmpMessages = [];

        try {
            const wrappedMessages = await contract.receiveMessage(activeChat.walletAddress);
            wrappedMessages.forEach( ( message ) => {
                tmpMessages.push({ "walletAddress": message[0], "timestamp": message[1], "content": message[2], "nonce": message[3] });
            })

        } catch (error) {
            console.log("ENTERED ERROR:", error);
            tmpMessages = null;
        }

        try{
            tmpMessages.forEach( (message) => {

                try {

                    let tmpPublicKey = Web3.utils.hexToBytes(activeChat.publicEncKey);
                    message.nonce = Web3.utils.hexToBytes(message.nonce);
                    message.content = Web3.utils.hexToBytes(message.content);

                    message.content = nacl.box.open(message.content, message.nonce, tmpPublicKey, secretKey);
                    message.content = naclUtil.encodeUTF8(message.content);

                } catch (error) {
                    console.log("ENTERED ERROR:", error);
                }
            })}
        catch{}
        

        setCurrentMessages(tmpMessages);

    }

    /**
     * @description Attempts to read the user's contacts from the smart contract. If successful, these are wrapped into contact objects wthin the program. These are then stored as contacts through the react hook.
     * @returns {void}
     */
    async function loadContacts() {

        let tmpContacts = [];

        try {

            const wrappedContacts = await contract.getContacts()

            wrappedContacts.forEach( ( item ) => {
                tmpContacts.push({ "username": item[0], "walletAddress": item[1], "publicEncKey": item[2] });
            })

        } catch (error) {
            tmpContacts = null;
        }

        try {
            if (tmpContacts.length === 0) {
                tmpContacts = null;
            }
        } catch (error) {
            console.log("ENTERED ERROR:", error);
        }

        setContacts(tmpContacts);
    }

    /**
     * @description useEffect that is triggered when the app is launched.
     * @returns {void}
     */
    useEffect(() => {

        /**
         * @description This only runs when the app is first opened. It checks that the user's browser is compatible with the technolgies used in the webapp. It also creates a database for scretKey storage if one does not exist.
         * @returns {void}
         */
        async function initialSetup() {
            if(window.ethereum) {
                window.ethereum.on('accountsChanged', handleAccountChanged);
            }
            else {
                alert("MetaMask is not installed.");
            }

            if (window.indexedDB) {
                const databasePromise = window.indexedDB.open("Site Storage", 1);

                databasePromise.onupgradeneeded = function(event) {
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

    /**
     * @description useEffect that is triggered when eiher, the user's wallet address or the smart contract connected to, changes.
     * @returns {void}
     */
    useEffect(() => {

        loadContacts();

    }, [myWalletAddress, contract]);

    /**
     * @description useEffect that is triggered when the selected chat is changed.
     * @returns {void}
     */
    useEffect(() => {

        loadMessages();

    }, [activeChat]);

    
    return (
        <div className="app">
                <TopNav 
                    loadMessages={loadMessages}
                    loadContacts={loadContacts}
                    username={username}
                    isDarkMode={isDarkMode}
                />
                <AddContactModal
                    isOpen={isAddContactOpen}
                    onRequestClose={closeAddContact}
                    addContact={addContact}
                    isDarkMode={isDarkMode}
                /> 
            <div className ="content">
                <SideNav
                    blockchatLogin={blockchatLogin}
                    walletAddress={myWalletAddress}
                    openSettings={openSettings}
                    isDarkMode={isDarkMode}
                />
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onRequestClose={closeSettings}
                    changeUsername={changeUsername}
                    activateDarkMode={activateDarkMode}
                    activateLightMode={activateLightMode}
                    isDarkMode={isDarkMode}
                />
                <ContactCardContainer
                    contacts={contacts}
                    activeChat={activeChat}
                    selectChat={selectChat}
                    openAddContact = {openAddContact}
                    isDarkMode={isDarkMode}
                />
                <MessageContainer 
                    messages = {currentMessages}
                    username = {activeChat.username}
                    myAddress = {myWalletAddress}
                    contactAddress = {activeChat.walletAddress}
                    publicEncKey = {activeChat.publicEncKey}
                    secretKey = {secretKey} 
                    sendMessage = {sendMessage}
                    sendETH = {sendETH}
                    openSendETH = {openSendETH}
                    isDarkMode={isDarkMode}
                />
                <SendETHModal
                    isOpen={isSendETHOpen}
                    onRequestClose={closeSendETH}
                    sendETH={sendETH}
                    myWalletAddress={myWalletAddress}
                    theirWalletAddress={activeChat.walletAddress}
                    isDarkMode={isDarkMode}
                />
            </div>
        </div>
    );
}

export default App;