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
        address walletAddress;
        contact[] contacts;
    }

    //Stores information relating to a user's contact.
    struct contact {
        string username;
        address walletAddress;
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
    function isUser(address walletAddress) public view returns(bool) {
        if (keccak256(bytes(registeredUsers[walletAddress].username)) == keccak256(bytes('')))  {
            return false;
        }
        else {
            return true;
        }
    }

    function getUser(address walletAddress) external view returns(string memory){
        bool isUserBool = isUser(walletAddress);
        require (isUserBool == true, "This user does not exist.");

        return (registeredUsers[walletAddress].username);
    }

    //Checks if a given name is just empty string.
    function emptyName(string calldata username) internal pure returns(bool) {
        if (keccak256(bytes(username)) == keccak256(bytes('')))  {
            return true;
        }
        else {
            return false;
        }
    }

    //Creates a new entry in registeredUsers based on the user's public key and assigns a name.
    function createUser(string calldata username) public {
        bool isUserBool = isUser(msg.sender);
        bool isEmptyBool = emptyName(username);
        require(isUserBool == false, "This user already has an account.");
        require(isEmptyBool == false, "You need to input a name.");

        registeredUsers[msg.sender].username = username;
        registeredUsers[msg.sender].walletAddress = msg.sender;
    }

    function removeUser() public {
        bool isUserBool = isUser(msg.sender);
        require(isUserBool == true, "This user does not have an account.");
        //Sets the currentUser into a variable.
        user storage currentUser = registeredUsers[msg.sender];
        // Iterate through the contacts array and remove each element
        for (uint256 i = 0; i < currentUser.contacts.length; i++) {
            delete currentUser.contacts[i];
        }
        // Set the user's data to default values
        currentUser.username = "";
        currentUser.walletAddress = address(0);
    }

    //Contact Managing Functions
    //Checks if the given address correpsonds to a user's contacts and returns true if so, false if not.
    function isContact(address contactwalletAddress) public view returns (bool) {
        for (uint i = 0; i < registeredUsers[msg.sender].contacts.length; i++) {
            if (registeredUsers[msg.sender].contacts[i].walletAddress == contactwalletAddress) {
                return true;
            }
        }
        return false;
    }

    function getContacts() public view returns (contact[] memory){
        return registeredUsers[msg.sender].contacts;
    }

    //Adds the given address as a contact under the name {USERNAME}.
    function addContact(address walletAddress, string calldata username) public {
        bool isContactBool = isContact(walletAddress);
        require(isContactBool == false, "This user is already in your contacts.");

        contact memory newContact = contact(username, walletAddress);
        registeredUsers[msg.sender].contacts.push(newContact);
    }

    //Removes the given contact from the user's contacts.
    function removeContact(address contactwalletAddress) public {
        bool isContactBool = isContact(contactwalletAddress);
        require(isContactBool == true, "This user is not in your contacts.");
        
        user memory currentUser = registeredUsers[msg.sender];

        for (uint i = 0; i < registeredUsers[msg.sender].contacts.length; i++) {
            contact memory currentContact = currentUser.contacts[i];
            if (currentContact.walletAddress == contactwalletAddress) {
                registeredUsers[msg.sender].contacts[i] = currentUser.contacts[currentUser.contacts.length - 1];
                registeredUsers[msg.sender].contacts.pop();
                return;
            }
        }
    }

    //Messaging Managing Functions
    //Creates unique hash based on the conversation participants and a 3rd random variable to identify which messages are which.
    function createHashCode(address walletAddress) internal view returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, walletAddress, nonce));
        return hash;
    }

    //Creates a new message structure with the needed info and then send it to the given address.
    function sendMessage(address walletAddress, string calldata content) external {
        bool userExistsBool = isUser(msg.sender);
        bool contactExistsBool = isUser(walletAddress);
        bool isContactBool = isContact(walletAddress);
        require(userExistsBool == true, "You do not have an account.");
        require(contactExistsBool == true, "This user does not exist.");
        require(isContactBool == true, "This user is not one of your contacts.");

        bytes32 uniqueHash = createHashCode(walletAddress);
        message memory newMessage = message(msg.sender, block.timestamp, content);

        allMessages[uniqueHash].push(newMessage);
    }

    //Reads the message history between the user and the given address, and returns it.
    function recieveMessage(address walletAddress) external view returns (message[] memory) {
        bytes32 uniqueHash = createHashCode(walletAddress);
        return allMessages[uniqueHash];
    }
}