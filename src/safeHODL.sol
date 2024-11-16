// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract SafeHodl {
    // storage
    mapping(bytes32 => LockBox) public vault;

    // events
    event NewLockBox(string email);
    event LockBoxOpened(string email);

    struct LockBox {
        bytes32 identifier; // hash of email and password
        string email;
        uint256 amount; // how much is stored in this lockbox
    }

    function lock(string calldata _email, bytes32 _passwordAndEmailHash) public payable {
        // check that funds are being sent into the function
        require(msg.value > 0, "Funds being sent must be greater than 0");

        // save the information
        vault[_passwordAndEmailHash] = LockBox({identifier: _passwordAndEmailHash, email: _email, amount: msg.value});

        // emit an event that the following
        emit NewLockBox(_email);
    }

    function unlock(string calldata _email, string calldata _password, address recipientAddress) public payable {
        require(recipientAddress != address(0), "Address cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_password).length > 0, "Email cannot be empty");

        // hash the email and password
        bytes32 passwordAndEmailHash = keccak256(abi.encodePacked(_email, _password));

        LockBox memory correctLockBox = vault[passwordAndEmailHash];

        // check that the hash exists in the storage
        require(vault[passwordAndEmailHash] != 0, "There is no Lockbox with the following email and password.");

        // check that the hashes match
        require(correctLockBox.identifier == passwordAndEmailHash, "Hashes do not match!");
        // check that the contract has enough funds to make the transfer
        require(address(this).balance >= correctLockBox.amount);

        // make the transfer to the destination address
        (bool success,) = payable(recipientAddress).call{value: correctLockBox.amount}("");
        require(success, "Paying out the user failed");

        // emit an event that everything went through
        emit LockBoxOpened(_email);
    }
}
