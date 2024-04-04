import React, { useEffect, useState } from "react";
import { SideNav, TopNav, ContactCardContainer, MessageContainer, AddContactModal } from "./react-components/react-components.jsx";
import { abi } from "./abi";
import { ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import Web3 from "web3";
import nacl from "tweetnacl";
import naclUtil, { encodeUTF8 } from 'tweetnacl-util';
import './App.css';

function App() {

    //Data Structures
    const CONTRACT_ADDRESS = "0xEA57799Cc2b7744639aB8D6d086F268f3838e464"
    //=====================================================================================================
    //Hooks
    const [contract, setContract] = useState(null);
    const [username, setUsername] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [myWalletAddress, setMyWalletAddress] = useState(null);
    const [activeChat, setActiveChat] = useState({ username: null, walletAddress: null , publicEncKey: null});
    const [currentMessages, setCurrentMessages] = useState(null);
    const [isAddContactOpen, setAddContactOpen] = useState(false);
    const [secretKey, setSecretKey] = useState(null);
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

            walletAddress = walletAddress.toLowerCase();
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
                let tmpSecretKey, request2;
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
            alert("Connected to BlockChat account.");

        } else {

            alert("Failed to login.");

        }
        
    }

    function selectChat(username, walletAddress, publicEncKey) {
        if (publicEncKey.startsWith('0x')) {
            publicEncKey = publicEncKey.slice(2);
        }
        setActiveChat({username, walletAddress, publicEncKey});
    }

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
        
                secretKey = await databasePromise;

                let nonce = nacl.randomBytes(nacl.box.nonceLength);

                console.log("=====ENTER SEND MESSAGE=====")

                console.log(
                    "BEFORE ENCRYPTION:", 
                    "Message: " + message + "\n" +
                    "Nonce: " + nonce + "\n" +
                    "PubEncKey: " + publicEncKey + "\n" +
                    "secretKey: " + secretKey + "\n"
                )

                message = naclUtil.decodeUTF8(message);

                let uint32Array = new Uint32Array(publicEncKey.match(/.{1,8}/g).map(byte => parseInt(byte, 16)));
                publicEncKey = new Uint8Array(uint32Array.buffer);

                let encryptedMessage = nacl.box(message, nonce, publicEncKey, secretKey);

                console.log("Array:" + testing2(publicEncKey, secretKey, nonce, message));

                console.log("AFTER ENCRYPTION:")
                console.log("Message: " + message)
                console.log("Nonce: " + nonce)
                console.log("PubEncKey: " + publicEncKey) 
                console.log("secretKey: " + secretKey)
                console.log("encMsg: " + encryptedMessage)

                console.log("MESSAGE BYTES:", Web3.utils.bytesToHex(encryptedMessage));

                let testObj = new Uint8Array([177,49,41,250,23,151,155,247,85,216,189,58,152,231,22,143,163,99,99,161,127]);

                console.log(testing2(publicEncKey, secretKey, nonce, encryptedMessage));

                let decryptedMessage = nacl.box.open(encryptedMessage, nonce, publicEncKey, secretKey);
                console.log("DECRYPTED:", naclUtil.encodeUTF8(decryptedMessage));

                console.log("=====EXIT SEND MESSAGE=====")

                await contract.sendMessage(walletAddress, encryptedMessage, nonce);
        } catch (error) {
            console.log("ENTERED ERROR:", error);
        }
    }

    async function addContact(walletAddress) {
        try {
            await contract.addContact(walletAddress)
        } catch (error) {
            //Do Nothing
            console.log(error)
        }
    }

    function openAddContact() {
        setAddContactOpen(true);
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
                tmpMessages.push({ "walletAddress": message[0], "timestamp": message[1], "content": message[2], "nonce": message[3] });
            })

        } catch (error) {
            console.log("errored:", error);
            tmpMessages = null;
        }

        try {
            tmpMessages.forEach( (message) => {

                console.log("=====ENTER LOAD MESSAGE=====")
                console.log(activeChat.publicEncKey)

                let tmpPublicKey = Web3.utils.hexToBytes(activeChat.publicEncKey);

                console.log("BEFORE CONVERSION (HEXES):");
                console.log("Message: " + message.content)
                console.log("Nonce: " + message.nonce)
                console.log("PubEncKey: " + tmpPublicKey) 
                console.log("secretKey: " + secretKey)

                console.log("MESSAGE BYTES:", Web3.utils.hexToBytes(message.content));

                /*if (message.nonce.startsWith('0x')) {
                    message.nonce = message.nonce.slice(2);
                }
                message.nonce = new Uint8Array(message.nonce.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));*/
                message.nonce = Web3.utils.hexToBytes(message.nonce);

            
                /*if (message.content.startsWith('0x')) {
                    message.content = message.content.slice(2);
                }
                let uint32Array = new Uint32Array(message.content.match(/.{1,8}/g).map(byte => parseInt(byte, 16)));
                message.content = new Uint8Array(uint32Array.buffer);*/
                message.content = Web3.utils.hexToBytes(message.content);
    

                console.log("AFTER CONVERSION (BYTE ARRAYS):");
                console.log("Message: " + message.content)
                console.log("Nonce: " + message.nonce)
                console.log("PubEncKey: " + tmpPublicKey) 
                console.log("secretKey: " + secretKey)

                console.log("MESSAGE BYTES:", Web3.utils.bytesToHex(message.content));

                message.content = nacl.box.open(message.content, message.nonce, tmpPublicKey, secretKey);
                message.content = naclUtil.encodeUTF8(message.content);

                console.log(message.content);

                console.log("Attempted Decryption:", naclUtil.encodeUTF8(message.content));

                console.log("=====EXIT LOAD MESSAGE=====")

            })
        } catch (error) {
            console.log("Errored:", error);
        }

        setCurrentMessages(tmpMessages);

    }

    async function loadContacts() {

        let tmpContacts = [];

        try {

            const wrappedContacts = await contract.getContacts()

            wrappedContacts.forEach( ( item ) => {
                tmpContacts.push({ "username": item[0], "walletAddress": item[1], "publicEncKey": item[2] });
                console.log(({ "username": item[0], "walletAddress": item[1], "publicEncKey": item[2] }));
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
                    activeChat={activeChat}
                    selectChat={selectChat}
                    openAddContact = {openAddContact}
                />
                <MessageContainer 
                    messages = {currentMessages}
                    username = {activeChat.username}
                    myAddress = {myWalletAddress}
                    contactAddress = {activeChat.walletAddress}
                    publicEncKey = {activeChat.publicEncKey}
                    secretKey = {secretKey} 
                    sendMessage = {sendMessage}
                />
            </div>
        </div>
    );
}

//DELETE
function testing1(pubKey, privkey, nonce, message) {
    let test1 = nacl.box.open(message, nonce, pubKey, privkey);
    test1 = naclUtil.encodeUTF8(test1)
    return test1;
}

function testing2(pubKey, privkey, nonce, message) {
    return { encryptedMessage: nacl.box(message, nonce, pubKey, privkey), nonce: nonce};
}

export default App;