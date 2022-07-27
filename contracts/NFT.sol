// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title ERC721 token
/// @author Bora Baloglu - OPVS (bora.baloglu@opvs.io)
contract NFT is ERC721URIStorage {
    uint256 public tokenId;

    mapping(uint256 => address) private _tokenIdToCreatorAddress;

    constructor() ERC721("OPVS", "OPVS") {}

    /// @notice Get all of owned tokens by msg.sender
    /// @return _ownedTokens An array of token ids that are owned by msg.sender
    function getOwnedTokens() public view returns (uint256[] memory) {
        uint256 _numberOfTokens = tokenId;
        uint256 _numberOfOwnedTokens = balanceOf(msg.sender);

        uint256[] memory _ownedTokens = new uint256[](_numberOfOwnedTokens);

        uint256 _currentIndexOfOwnedTokens = 0;
        for (uint256 i = 1; i <= _numberOfTokens; i++) {
            if (ownerOf(i) == msg.sender) {
                _ownedTokens[_currentIndexOfOwnedTokens] = i;
                _currentIndexOfOwnedTokens++;
            }
        }

        return _ownedTokens;
    }

    /// @notice Get all of the created tokens by msg.sender
    /// @return _createdTokens An array of token ids that are created by msg.sender
    function getCreatedTokens() public view returns (uint256[] memory) {
        uint256 _numberOfTokens = tokenId;

        uint256 _numberOfCreatedTokens = 0;
        for (uint256 i = 1; i <= _numberOfTokens; i++) {
            if (msg.sender == _tokenIdToCreatorAddress[i]) {
                _numberOfCreatedTokens++;
            }
        }

        uint256[] memory _createdTokens = new uint256[](_numberOfCreatedTokens);

        uint256 _currentIndexOfCreatedTokens = 0;
        for (uint256 i = 1; i <= _numberOfTokens; i++) {
            if (msg.sender == _tokenIdToCreatorAddress[i]) {
                _createdTokens[_currentIndexOfCreatedTokens] = i;
                _currentIndexOfCreatedTokens++;
            }
        }

        return _createdTokens;
    }

    /// @notice Mint new token
    /// @param _tokenURI The URI of token that holds metadata of the token
    /// @return _tokenId The id of new token
    function mint(string memory _tokenURI) external returns (uint256) {
        tokenId++;
        uint256 _tokenId = tokenId;

        _tokenIdToCreatorAddress[_tokenId] = msg.sender;

        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);

        return _tokenId;
    }
}
