// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    event NewWave(address indexed from, uint256 timestamp, string message);
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }
    Wave[] waves;

    constructor() {
        console.log("This be the constructor...");
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s waved with message %s", msg.sender, _message);
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getWaveCount() public view returns (uint256) {
        return totalWaves;
    }
}
