// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenFarm is Ownable {
    address[] allowedTokenList;
    // mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;

    function stakeTokens(uint256 _amount, address _token) public {
        require(_amount > 0, "Amount has to be greater than zero");
        require(tokenIsAllowed(_token), "Token is currently not allowed");

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        stakingBalance[_token][msg.sender] += _amount;
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        for (uint256 i = 0; i < allowedTokenList.length; i++) {
            if (allowedTokenList[i] == _token) return true;
        }
        return false;
    }

    function addAllowedToken(address _token) public onlyOwner {
        allowedTokenList.push(_token);
    }
}
