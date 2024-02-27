// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 < 0.9.0;

/**
*@title Messaging Contract
*@dev Facilitating messaging, and the associated actions, between users.
*/
contract MessagingContract {
    //Values
    //Hash Modifiyng Nonce
    uint256 constant private nonce = 8742963158;
    //=====================================================================================================
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
    function isUser(address publicKey) internal view returns(bool) {
        if (registeredUsers[publicKey].name != "")  {
            return true;
        }
        else {
            return false;
        }
    }

    //Checks if a given name is just empty string.
    function emptyName(string username) internal view returns(bool) {
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
        bool isEmptyBool = emptyName(username);
        require(isUserBool == false, "This user already has an account.");
        require(isEmptyBool == false, "You need to input a name.");

        registeredUsers[msg.sender].name = username;
        registeredUsers[msg.sender].publicKey = msg.sender;
    }

    //Contact Managing Functions
    //Checks if the given address correpsonds to a user's contacts and returns true if so, false if not.
    function isContact(address contactPublicKey) public view returns (bool) {
        for (uint i = 0; i < registeredUsers[msg.sender].contacts.length; i++) {
            if (registeredUsers[msg.sender].contacts[i].publicKey == contactPublicKey) {
                return true;
            }
        }
        return false;
    }

    //Adds the given address as a contact under the name {USERNAME}.
    function addContact(address publicKey, string username) public {
        bool isContactBool = isContact(publicKey);
        require(isContactBool == false, "This user is already in your contacts.");

        contact newContact = contact(username, publicKey);
        registeredUsers[msg.sender].contacts.push(newContact);
    }

    //Removes the given contact from the user's contacts.
    function removeContact(address contactPublicKey) public {
        bool isContactBool = isContact(publicKey);
        require(isContactBool == true, "This user is not in your contacts.");
        
        user currentUser = registeredUsers[msg.sender];

        for (uint i = 0; i < registeredUsers[msg.sender].contacts.length; i++) {
            contact currentContact = currentUser.contacts[i];
            if (currentContact.publicKey == contactPublicKey) {
                registeredUsers[msg.sender].contacts[i] = currentUser.contacts[currentUser.contacts.length - 1];
                registeredUsers[msg.sender].contacts.pop()
                return;
            }
        }
    }

    //Messaging Managing Functions
    //Creates unique hash based on the conversation participants and a 3rd random variable to identify which messages are which.
    function createHashCode(address publicKey) internal pure returns bytes32 {
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, publicKey, nonce))
        return hash;
    }

    //Creates a new message structure with the needed info and then send it to the given address.
    function sendMessage(address publicKey, string content) external {
        bool userExistsBool = isUser(msg.sender);
        bool contactExistsBool = isUser(publicKey);
        bool isContactBool = isContact(publicKey);
        require(userExistsBool == true, "You do not have an account.");
        require(contactExistsBool == true, "This user does not exist.");
        require(isContactBool == true, "This user is not one of your contacts.");

        bytes32 uniqueHash = createHashCode(publicKey);
        message newMessage = message(msg.sender, block.timestamp, content);

        allMessages[uniqueHash].push(newMessage);
    }

    //Reads the message history between the user and the given address, and returns it.
    function recieveMessage(address publicKey) external view {
        bytes32 uniqueHash = createHashCode(publicKey);
        return allMessages[uniqueHash];
    }
}