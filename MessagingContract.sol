// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 < 0.9.0;

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
    //=====================================================================================================
    //Mappings
    //Mapping containing all messages within the contract.
    mapping(bytes32 => message[]) allMessages;

    //Mapping containing all of the application's registered users.
    mapping(address => user) registeredUsers;
    //=====================================================================================================
    //Functions
    //User Managing Functions
    function isUser(address publicKey) public view returns(bool) {
        if (registeredUsers[publicKey].name != "")  {
            return true;
        }
        else {
            return false;
        }
    }

    //Checks if a given name is just empty string.
    function emptyName(string username) public view returns(bool) {
        if(username == "") {
            return true;
        }
        else {
            return false;
        }
    }

    //Creates a new entry in registeredUsers based on the user's public key and assigns a name.
    function createUser(string username) public returns(bool) {
        bool isUserBool = isUser(msg.sender);
        bool isEmpty = emptyName(username);

        require(isUserBool == false, "This user already has an account.");
        require(isEmptyBool == false, "You need to input a name.");

        registeredUsers[msg.sender].name = username;
        registeredUsers[msg.sender].publicKey = msg.sender;
    }

    //Contact Managing Functions
    //Checks if the given address correpsonds to a user's contacts.
    function isContact(address publicKey) public view returns (bool) {
        //Add Code
    }

    //Adds the given address as a contact under the name {USERNAME}.
    function addContact(address publicKey, string username) public {
        //Add Code
    }

    //Removes the given contact and therefore delete your chat history.
    function removeContact(address publicKey) public {
        //Add Code
    }

    //Messaging Managing Functions
    //Creates a new message structure with the needed info and then send it to the given address.
    function sendMessage(address publicKey, string content) public {
        //Add Code
    }

    //Reads the message history between the user and the given address, and returns it.
    function recieveMessage() external view {
        //Add Code
    }
}