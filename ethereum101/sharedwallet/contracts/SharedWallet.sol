// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract SharedWallet {
  address public walletOwner;
  uint256 public balance;
  string public message;

  constructor() {
    walletOwner = msg.sender;
  }

  function deposit() public payable {
    require(msg.value != 0, "Come on, penny-pincher, gimme some money.");
    balance += msg.value;
  }

  function withdraw(address payable _to, uint256 _total) public payable {
        require(
            _total <= balance,
            "You are asking for more than we can give you :("
        );

        balance -= _total;
        _to.transfer(_total);
    }

  function setMessage(string memory _message) external {
    message = _message;
  }
}