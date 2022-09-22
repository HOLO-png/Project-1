// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./Crowdsale.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract MyTokenSale is Crowdsale {
    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token
    )
        Crowdsale(rate, wallet, token)
    {

    }
}