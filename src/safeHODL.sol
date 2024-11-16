// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract SafeHodl {
    // storage
    mapping(bytes32 => LockBox) public vault;

    // events
    event NewLockBox(string email);

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

}
