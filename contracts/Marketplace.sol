// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    uint256 public saleFeePercentage = 1;
    uint256 public marketItemId;
    uint256 private _numberOfMarketItemsSold;
    uint256 private _numberOfMarketItemsCancelled;
    address private _owner;

    struct MarketItem {
        uint256 marketItemId;
        address nftContractAddress;
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool onSale;
        bool sold;
    }

    mapping(uint256 => MarketItem) marketItemIdToMarketItem;

    constructor() {
        _owner = msg.sender;
    }

    /// @notice Get all of the market items that currently on sale
    /// @return _onSaleMarketItems On sale market items
    function getOnSaleMarketItems() external view returns (MarketItem[] memory) {
        uint256 _numberOfMarketItems = marketItemId;
        uint256 _numberOfMarketItemsOnSale = _numberOfMarketItems -
            _numberOfMarketItemsCancelled -
            _numberOfMarketItemsSold;

        MarketItem[] memory _onSaleMarketItems = new MarketItem[](_numberOfMarketItemsOnSale);

        uint256 _currentOnSaleMarketItemIndex = 0;
        for (uint256 i = 1; i <= _numberOfMarketItems; i++) {
            if (marketItemIdToMarketItem[i].onSale == true) {
                _onSaleMarketItems[_currentOnSaleMarketItemIndex] = marketItemIdToMarketItem[i];
                _currentOnSaleMarketItemIndex++;
            }
        }

        return _onSaleMarketItems;
    }

    /// @notice Create new market item from a minted token
    /// @dev Only owner of the token can create market item.
    /// Price of the market item must be greater than zero.
    /// On success, the token will be transferred from the owner to the marketplace contract .
    /// @param _nftContractAddress The address of the nft contract
    /// @param _price The price of the market item
    /// @param _tokenId The id of token that will be sold
    /// @return _marketItemId The id of new market item
    function createMarketItem(
        address _nftContractAddress,
        uint256 _price,
        uint256 _tokenId
    ) external payable nonReentrant returns (uint256) {
        require(_price > 0, "Price must be greater than zero");

        marketItemId++;
        uint256 _marketItemId = marketItemId;

        marketItemIdToMarketItem[_marketItemId] = MarketItem(
            _marketItemId,
            _nftContractAddress,
            _tokenId,
            msg.sender,
            address(0),
            _price,
            true,
            false
        );

        IERC721(_nftContractAddress).transferFrom(msg.sender, address(this), _tokenId);

        return _marketItemId;
    }

    /// @notice Cancel market item.
    /// @dev Only seller of the market item can cancel.
    /// On success, the token will be transferred from the marketplace contract to the seller.
    /// @param _marketItemId The id of market item that will be cancelled
    function cancelMarketItem(uint256 _marketItemId) external payable nonReentrant {
        uint256 _tokenId = marketItemIdToMarketItem[_marketItemId].tokenId;

        require(_tokenId > 0, "Market item does not exist");

        require(marketItemIdToMarketItem[_marketItemId].seller == msg.sender, "You are not the seller");

        IERC721(marketItemIdToMarketItem[_marketItemId].nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        marketItemIdToMarketItem[_marketItemId].owner = msg.sender;
        marketItemIdToMarketItem[_marketItemId].onSale = false;

        _numberOfMarketItemsCancelled++;
    }

    /// @notice Create market sale
    /// @dev msg.value must be equal to price of market item + sale fee
    /// On success, the token will be transferred from the marketplace contract to the buyer.
    /// On success, the price will be transferred from the buyer to the seller.
    /// On success, the sale fee will be transferred from buyer to the marketplace owner.
    /// @param _marketItemId The id of market item that will be sold
    function createMarketSale(uint256 _marketItemId) external payable nonReentrant {
        require(marketItemIdToMarketItem[_marketItemId].seller != msg.sender, "You cannot buy your market item");

        uint256 _price = marketItemIdToMarketItem[_marketItemId].price;
        uint256 _saleFee = (_price * saleFeePercentage) / 100;

        require(msg.value == _price + _saleFee, "Value must be equal to price + saleFee");

        uint256 _tokenId = marketItemIdToMarketItem[_marketItemId].tokenId;

        payable(marketItemIdToMarketItem[_marketItemId].seller).transfer(_price);

        IERC721(marketItemIdToMarketItem[_marketItemId].nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        marketItemIdToMarketItem[_marketItemId].owner = msg.sender;
        marketItemIdToMarketItem[_marketItemId].onSale = false;
        marketItemIdToMarketItem[_marketItemId].sold = true;

        _numberOfMarketItemsSold++;

        payable(_owner).transfer(_saleFee);
    }
}
