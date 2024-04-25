// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 < 0.9.0;

/**
 * @title Messaging Contract
 * @dev Facilitating messaging, and the associated actions, between users.
 */
contract MessagingContract {

    //=====================================================================================================
    //Data Structures

    /**
     * @dev This is a randomly generated value that modifies the hash code created between two users.
     */
    uint256 constant private value = 8742963158;

    /**
     * @dev Stores information relating to the current user.
     */
    struct user {
        string username;
        address walletAddress;
        bytes32 publicEncKey;
        contact[] contacts;
    }

    /**
     * @dev Stores information relating to a user's contact.
     */
    struct contact {
        string username;
        address walletAddress;
        bytes32 publicEncKey;
    }

    /**
     * @dev Stores information relating to an individual message.
     */
    struct message {
        address sender;
        uint256 timestamp;
        bytes content;
        bytes24 nonce;
    }

    /**
     * @dev Mapping containing all messages within the contract.
     */
    mapping(bytes32 => message[]) allMessages;

    /**
     * @dev Mapping containing all of the application's registered users.
     */
    mapping(address => user) registeredUsers;

    //=====================================================================================================
    //Functions

    /**
     * @param walletAddress The address of an ETH wallet.
     * @dev Takes an address and checks if it is associated with a BlockChat account.
     * @return boolean true if account exists, false if not.
     */
    function isUser(address walletAddress) public view returns(bool) {
        if (keccak256(bytes(registeredUsers[walletAddress].username)) == keccak256(bytes('')))  {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * @param walletAddress The address of an ETH wallet.
     * @dev Takes an address and returns the associated BlockChat account if one exists.
     * @return user User associated with the wallet address.
     */
    function getUser(address walletAddress) external view returns(string memory){
        bool isUserBool = isUser(walletAddress);
        require (isUserBool == true, "This user does not exist.");

        return (registeredUsers[walletAddress].username);
    }

    /**
     * @param username A string containing a potential username.
     * @dev Checks if a given name is just an empty string.
     * @return boolean true if string is empty, false if not.
     */
    function emptyName(string calldata username) internal pure returns(bool) {
        if (keccak256(bytes(username)) == keccak256(bytes('')))  {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @param username A string containing a potential username.
     * @param publicEncKey A bytes32 array containing a public encryption key.
     * @dev Creates a new entry in registeredUsers based on the user's public key, wallet address and a given username.
     */
    function createUser(string calldata username, bytes32 publicEncKey) public {
        bool isUserBool = isUser(msg.sender);
        bool isEmptyBool = emptyName(username);
        require(isUserBool == false, "This user already has an account.");
        require(isEmptyBool == false, "You need to input a name.");

        registeredUsers[msg.sender].username = username;
        registeredUsers[msg.sender].walletAddress = msg.sender;
        registeredUsers[msg.sender].publicEncKey = publicEncKey;
    }

    /**
     * @dev As long as a user has an account, it is then deleted.
     * @notice This is only for development purposes, not a feature.
     */
    function removeUser() public {
        bool isUserBool = isUser(msg.sender);
        require(isUserBool == true, "This user does not have an account.");

        user storage currentUser = registeredUsers[msg.sender];

        for (uint256 i = 0; i < currentUser.contacts.length; i++) {
            delete currentUser.contacts[i];
        }

        currentUser.username = "";
        currentUser.walletAddress = address(0);
    }

    /**
     * @param newUsername A string containing a new username.
     * @dev Find the account associated with the transaction sender's address and change the username.
     */
    function changeUsername(string calldata newUsername) public {
        registeredUsers[msg.sender].username = newUsername;
    }

    /**
     * @param contactwalletAddress An ETH wallet address.
     * @dev Checks through the user's contacts and finds out if any of them match the given address.
     * @return boolean true if the address is a contact, false if not.
     */
    function isContact(address contactwalletAddress) public view returns (bool) {
        for (uint i = 0; i < registeredUsers[msg.sender].contacts.length; i++) {
            if (registeredUsers[msg.sender].contacts[i].walletAddress == contactwalletAddress) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Retrieves the user's full list of contacts.
     * @return contact[] A list of the user's contacts.
     */
    function getContacts() public view returns (contact[] memory){
        return registeredUsers[msg.sender].contacts;
    }

    /**
     * @param walletAddress An ETH wallet address.
     * @dev As long as the given address has an account and isn't already in the user's contacts, the address is added to contacts.
     * @return boolean true if contact successfully added, false if not.
     */
    function addContact(address walletAddress) public returns (bool){
        bool isContactBool = isContact(walletAddress);
        bool isUserBool = isUser(walletAddress);
        require(isContactBool == false, "This user is already in your contacts.");
        require(isUserBool == true, "This user doesn't have an account.");

        user memory otherUser = registeredUsers[walletAddress];

        if (bytes(otherUser.username).length == 0) {
            return false;
        } else {
            contact memory newContact = contact(otherUser.username, otherUser.walletAddress, otherUser.publicEncKey);
            registeredUsers[msg.sender].contacts.push(newContact);
            return true;
        }
    }

    /**
     * @param contactWalletAddress An ETH wallet address.
     * @dev As long as the given address is already in the user's contacts, the address is removed from contacts.
     * @notice This is only for development purposes, not a feature.
     */
    function removeContact(address contactWalletAddress) public {
        bool isContactBool = isContact(contactWalletAddress);
        require(isContactBool == true, "This user is not in your contacts.");
        
        user memory currentUser = registeredUsers[msg.sender];

        for (uint i = 0; i < registeredUsers[msg.sender].contacts.length; i++) {
            contact memory currentContact = currentUser.contacts[i];
            if (currentContact.walletAddress == contactWalletAddress) {
                registeredUsers[msg.sender].contacts[i] = currentUser.contacts[currentUser.contacts.length - 1];
                registeredUsers[msg.sender].contacts.pop();
                return;
            }
        }
    }

    /**
     * @param walletAddress An ETH wallet address.
     * @param content The encrypted message content.
     * @param messageNonce Randomly generated number-used-once tied to the message's encryption/decryption.
     * @dev The wallet address is used to create a hash code to identify the chat, whilst the other information is wrapped into a message object which is stored in the allMessages mapping, only retrievable with the hash code.
     * @dev This also contains logic to update a user's contacts. This handles the displaying of usernames that have been modified. It was placed here to save on gas fees.
     */
    function sendMessage(address walletAddress, bytes calldata content, bytes24 messageNonce) external {
        bool userExistsBool = isUser(msg.sender);
        bool contactExistsBool = isUser(walletAddress);
        bool isContactBool = isContact(walletAddress);
        require(userExistsBool == true, "You do not have an account.");
        require(contactExistsBool == true, "This user does not exist.");
        require(isContactBool == true, "This user is not one of your contacts.");

        //Updated Username Handling
        contact[] memory tmpContacts = new contact[](registeredUsers[msg.sender].contacts.length);
        for (uint i = 0; i < registeredUsers[msg.sender].contacts.length; i++) {
            user memory tmpUser = registeredUsers[registeredUsers[msg.sender].contacts[i].walletAddress];
            contact memory tmpContact = contact(tmpUser.username, tmpUser.walletAddress, tmpUser.publicEncKey);
            tmpContacts[i] = (tmpContact);
        }

        for (uint j = 0; j < tmpContacts.length; j++) {
            registeredUsers[msg.sender].contacts[j] = tmpContacts[j];
        }
        //

        bytes32 uniqueHash = createHashCode(walletAddress);
        message memory newMessage = message(msg.sender, block.timestamp, content, messageNonce);

        allMessages[uniqueHash].push(newMessage);
    }

    /**
     * @param walletAddress An ETH wallet address.
     * @dev Generates a hash code to identify where to read the messages from. Then returns the messages.
     * @return message[] A list of messages between the user and contact.
     */
    function receiveMessage(address walletAddress) external view returns (message[] memory) {
        bytes32 uniqueHash = createHashCode(walletAddress);
        return allMessages[uniqueHash];
    }

    /**
     * @param walletAddress An ETH wallet address.
     * @dev Creates unique hash based using the keccak256 hash. This is created using the conversation participants and a 3rd random variable to create a code. This code is then ordered to account for the different order the addresses will be called with depending on who calls it.
     * @return bytes32 A hash code identifying chat messages within the contract.
     */
    function createHashCode(address walletAddress) internal view returns (bytes32) {
        bytes32 hash1 = keccak256(abi.encodePacked(msg.sender, walletAddress, value));
        bytes32 hash2 = keccak256(abi.encodePacked(walletAddress, msg.sender, value));
        return (hash1 < hash2 ? hash1 : hash2);
    }
}