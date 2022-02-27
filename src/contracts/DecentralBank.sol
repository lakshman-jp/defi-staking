// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.22 <0.9.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank{
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    event Addrs(address _owner, address _contract, uint _amount);

    // stacking function
    function depositTokens(uint _amount) public {
        // require staking amount to be greater than 0
        require(_amount > 0, 'Amount can not be less than 0.');

        // Transfer Tether token to this contract for Staking
         tether.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount; 

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        // require the amount to be greater than zero
        require(balance > 0, 'Staking balance cannot be less than 0.');

        // transfer the balance to the specified contract address from our bank
        tether.transfer(msg.sender, balance);

        // reset the staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking balance
        isStaking[msg.sender] = false;

    }


    // issue rewards
    function issueTokens() public {
        // require the owner to issue the tokens only
        require(msg.sender == owner, 'Caller must be the Owner');

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9;
            if(balance > 0) {
            rwd.transfer(recipient, balance);             
            }
        }

    }


}