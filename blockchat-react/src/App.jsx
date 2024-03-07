import React, { useEffect, useState } from "react";
import { SideNav, TopNav, ContactCardContainer } from "./react-components/react-components.jsx";
import { abi } from "./abi";
import { ethers } from "ethers";
import { Web3Provider } from '@ethersproject/providers';

function App() {

    //Data Structures
    const CONTRACT_ADDRESS = "0x144cF39ac88B6576Ae217418bE36E35753C4c429"
    let activeChats = [];
    //=====================================================================================================
    //Hooks
    const [contract, setContract] = useState(null);
    const [username, setUsername] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [activeChat, setActiveChat] = useState({ username: null, walletAddress: null });

    //=====================================================================================================
    //Functions
    //Connecting to user's MetaMask wallet to identify them.
    //Returns TRUE if successful, FALSE if not.
    async function connectToWallet() {
        //Opens a window to sign-in to MetaMask. This is a promise that will either succeed, and follow the
        //then branch, or fail, and follow the catch branch. 
        window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(function (accounts) {
            const walletAddress = accounts[0];
            setWalletAddress(walletAddress);
            console.log("Connected to user account.");
            console.log(walletAddress);
            return true;
        })
        .catch(function (error) {
            console.error("Not connected to user account. Error: " + error);
            return false;
        });
    }

    function connectToContract() {
        try {
            const provider = new Web3Provider( window.ethereum );
            const signer = provider.getSigner();
            let contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
            setContract(contract);
            return true;
        } catch (error) {
            console.error("Not connected to contract. Error: " + error);
            return false;
        }
    }

    //If the user has connected their MetaMask wallet, tries to login to the associated BlockChat account. If one does
    //not exist, the user is prompted to create one.
    async function blockchatLogin() {
        const isWalletConnected = connectToWallet();
        if (isWalletConnected) {
            const isContractConnected = connectToContract();
            if (isContractConnected) {
                let username;
                const isUser = await contract.isUser(walletAddress);
                if (isUser) {
                    username = await contract.getUser(walletAddress);
                } else {
                    username = prompt("You do not have an account. Please enter a username to create one.");
                    if (username === "") {
                        username = "newUser";
                    }
                    await contract.createUser(username);
                }
                console.log(username);
                setUsername(username);
            } else {
                alert("Contract is not connected.");
                return false;
            }
        } else {
            alert("No wallet is connected.");
            return false;
        }
        
        return true;
    }

    async function getContacts() {
        let contacts = [];
        try {
            const wrappedContacts = await contract.getContacts
            wrappedContacts.forEach( ( item ) => {
                contacts.push({ "username": item[0], "walletAddress": item[1] });
            })
        } catch (error) {
            contacts = [];
        }
        setContacts(contacts);
        return contacts;
    }

    useEffect(getContacts, [walletAddress, contract]);

    return (
        <div className="app">
            <div className="navs">
                <TopNav />
                <SideNav blockchatLogin={blockchatLogin}/>
            </div>
            <ContactCardContainer
                contacts={getContacts}
                activeChat={activeChat}
                //selectChat={selectChat}
            />
        </div>
    );
}

export default App;