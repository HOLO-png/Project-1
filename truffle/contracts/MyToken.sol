// SPDX-License-Identifier: MIT
pragma solidity >=0.6.1 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Iphone 12Promax", "APPLE") {
        _mint(msg.sender, initialSupply);
    }
}