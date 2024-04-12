import React, { useEffect, useState } from "react";
import { SideNav, TopNav, ContactCardContainer, MessageContainer, AddContactModal, SettingsModal, SendETHModal } from "./react-components/react-components.jsx";
import { abi } from "./abi";
import { ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import Web3 from "web3";
import nacl from "tweetnacl";
import naclUtil, { encodeUTF8 } from 'tweetnacl-util';
import './App.css';

function App() {

    //Data Structures
    const CONTRACT_ADDRESS = "0x66f352c6F664535b9f3ED01a9391d712858ECeCa"
    //=====================================================================================================
    //Hooks
    const [contract, setContract] = useState(null);
    const [username, setUsername] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [myWalletAddress, setMyWalletAddress] = useState(null);
    const [activeChat, setActiveChat] = useState({ username: null, walletAddress: null , publicEncKey: null});
    const [currentMessages, setCurrentMessages] = useState(null);
    const [isAddContactOpen, setAddContactOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isDarkMode, setDarkMode] = useState(false);
    const [secretKey, setSecretKey] = useState(null);
    const [isSendETHOpen, setSendETHOpen] = useState(false);
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

        } catch (error) {
            console.log("ENTERED ERROR:", error);
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

    async function changeUsername(newUsername) {
        try {
            await contract.changeUsername(newUsername);
        } catch (error) {
            console.log("ENTERED ERROR:", error);
        }
    }

    async function addContact(walletAddress) {
        try {
            await contract.addContact(walletAddress)
        } catch (error) {
            console.log("ENTERED ERROR:", error);
        }
    }

    function openAddContact() {
        setAddContactOpen(true);
    }

    function closeAddContact() {
        setAddContactOpen(false);
    }

    function openSettings() {
        setSettingsOpen(true);
    }

    function closeSettings() {
        setSettingsOpen(false);
    }

    function openSendETH() {
        console.log("clicked2");
        setSendETHOpen(true);
    }

    function closeSendETH() {
        setSendETHOpen(false);
    }

    function sendETH(myWalletAddress, theirWalletAddress, ethValue) {
        const web3 = new Web3(window.ethereum);
        const weiValue = web3.utils.toWei(ethValue, 'ether');
        console.log(ethValue, weiValue);

        web3.eth.sendTransaction({
            from: myWalletAddress,
            to: theirWalletAddress,
            value: weiValue,
            gas: 50000
        })
        .on("transactionHash", (hash) => {
            alert("ETH transferred successfully.");
        })
        .on('error', (error) => {
            console.log("Transaction error:", error);
            alert("ETH failed to send.");
        });
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
                    username={username}
                />
                <AddContactModal
                    isOpen={isAddContactOpen}
                    onRequestClose={closeAddContact}
                    addContact={addContact}
                />                
            <div className ="content">
                <SideNav
                    blockchatLogin={blockchatLogin}
                    walletAddress={myWalletAddress}
                    openSettings={openSettings}
                />
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onRequestClose={closeSettings}
                    changeUsername={changeUsername}
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
                    sendETH = {sendETH}
                    openSendETH = {openSendETH}
                />
                <SendETHModal
                    isOpen={isSendETHOpen}
                    onRequestClose={closeSendETH}
                    sendETH={sendETH}
                    myWalletAddress={myWalletAddress}
                    theirWalletAddress={activeChat.walletAddress}
                />
            </div>
        </div>
    );
}

export default App;