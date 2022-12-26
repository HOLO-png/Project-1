// SPDX-License-Identifier: MIT
pragma solidity >=0.6.1 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("Phung Truong Dinh Quan Token", "PTDQ") {
        _mint(msg.sender, 10000000000000);
    }
}
