// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract CardsVerifier {
    function verifyCards(
        uint8[] memory indexes,
        uint64[] memory cards,
        bytes32 commitment
    ) public view returns (bool) {
        uint256 len = indexes.length;
        require(len == cards.length, "E1");

        for (uint256 i = 1; i < len; i++) {
            require(indexes[i] > indexes[i - 1], "E2");
        }

        // TODO
    }
}
