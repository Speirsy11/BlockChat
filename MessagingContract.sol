// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
*@title Messaging Contract
*@dev Facilitating messaging, and the associated actions, between users.
*/
contract MessagingContract {

    //Structures
    //Stores information relating to the current user.
    struct user {
        string username;
        address publicKey;
        contact[] contacts;
    }

    //Stores information relating to a user's contact.
    struct contact {
        string username;
        address publicKey;
    }

    //Stores information relating to an individual message.
    struct message {
        address sender;
        uint256 timestamp;
        string content;
    }

    //Mappings
    //Mapping containing all messages within the contract.
    mapping(bytes32 => message[]) allMessages;

    //Mapping containing all of the application's registered users.
    mapping(address => user) registeredUsers;

    //Functions
    //User Managing Functions
    function isUser(address publicKey) public view returns(bool) {
        //Add Code
    }

    //Creates a new account based on the user's public key.
    function createUser(address publicKey) public view returns(bool) {
        //Add Code
    }

    //Contact Managing Functions
    //Checks if the given address correpsonds to a user's contacts.
    function isContact(address publicKey) public view returns (bool) {
        //Add Code
    }

    //Messaging Managing Functions
    //function sendMessage(address publicKey) 
}