// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./Crowdsale.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./KycContract.sol";
import "./MyToken.sol";

contract MyTokenSale is Crowdsale, Ownable {
    KycContract kyc;
    MyToken public myToken;
    uint256 public constant tokensPerEth = 100;

    event BuyToken(address buyer, uint256 ethAmount, uint256 tokenAmount);
    event SellToken(address seller, uint256 ethAmount, uint256 tokenAmount);

    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc,
        address tokenAddress
    ) Crowdsale(rate, wallet, token) {
        kyc = _kyc;
        myToken = MyToken(tokenAddress);
    }

    fallback() external payable {}

    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
        override
    {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(
            kyc.kycCompleted(msg.sender),
            "KYC not completed, purchase not allowed"
        );
    }

    function buy() public payable {
        require(msg.value > 0, "Send some ETH to buy tokens");
        address user = msg.sender;
        uint256 ethAmount = msg.value;
        _preValidatePurchase(user, ethAmount);
        uint256 tokenAmount = ethAmount * tokensPerEth;
        bool sent = myToken.transfer(user, tokenAmount);
        require(sent, "Failed");
        emit BuyToken(user, ethAmount, tokenAmount);
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Nothing to withdraw");
        address user = msg.sender;
        (bool success, ) = user.call{value: address(this).balance}("");
        require(success, "Failed");
    }

    function sell(uint256 tokenAmount) public {
        address user = msg.sender;
        uint256 userTokenBalance = myToken.balanceOf(user);

        require(userTokenBalance >= tokenAmount, "Not enough token");
        uint256 ethAmount = tokenAmount / tokensPerEth;
        require(address(this).balance >= ethAmount, "Not enough ETH at APPLE");
        bool sent = myToken.transferFrom(user, address(this), tokenAmount);
        require(sent, "Failed");

        (bool success, ) = user.call{value: ethAmount}("");
        require(success, "Failed");

        emit SellToken(user, ethAmount, tokenAmount);
    }
}
