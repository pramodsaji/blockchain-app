// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataStorageContract {
    struct Data {
        uint256 id;
        string name;
    }

    mapping(uint256 => Data) public dataMap;

    function addData(uint256 id, string memory name) public {
        dataMap[id] = Data(id, name);
    }

    function getData(uint256 id) public view returns (uint256, string memory) {
        Data memory data = dataMap[id];
        return (data.id, data.name);
    }
}