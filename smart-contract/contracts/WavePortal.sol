// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 private seed;
    uint256 totalWaves;
    event NewWave(address indexed from, uint256 timestamp, string message);
    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }
    Wave[] waves;
    mapping (address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("This be the constructor...");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(lastWavedAt[msg.sender] + 15 minutes <= block.timestamp, "Wait 15m");
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s waved with message %s", msg.sender, _message);
        waves.push(Wave(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random number generated: %d", seed);

        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "The contract ain't got that kind of money dude!"
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to send money to waver.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);

    }

    function getWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getWaveCount() public view returns (uint256) {
        return totalWaves;
    }
}
