# Solidity API

## Marketplace

### saleFeePercentage

```solidity
uint256 saleFeePercentage
```

### marketItemId

```solidity
uint256 marketItemId
```

### _numberOfMarketItemsSold

```solidity
uint256 _numberOfMarketItemsSold
```

### _numberOfMarketItemsCancelled

```solidity
uint256 _numberOfMarketItemsCancelled
```

### _owner

```solidity
address _owner
```

### MarketItem

```solidity
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
```

### marketItemIdToMarketItem

```solidity
mapping(uint256 => struct Marketplace.MarketItem) marketItemIdToMarketItem
```

### constructor

```solidity
constructor() public
```

### getOnSaleMarketItems

```solidity
function getOnSaleMarketItems() external view returns (struct Marketplace.MarketItem[])
```

Get all of the market items that currently on sale

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct Marketplace.MarketItem[] | _onSaleMarketItems On sale market items |

### createMarketItem

```solidity
function createMarketItem(address _nftContractAddress, uint256 _price, uint256 _tokenId) external payable returns (uint256)
```

Create new market item from a minted token

_Only owner of the token can create market item.
Price of the market item must be greater than zero.
On success, the token will be transferred from the owner to the marketplace contract ._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _nftContractAddress | address | The address of the nft contract |
| _price | uint256 | The price of the market item |
| _tokenId | uint256 | The id of token that will be sold |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | _marketItemId The id of new market item |

### cancelMarketItem

```solidity
function cancelMarketItem(uint256 _marketItemId) external payable
```

Cancel market item.

_Only seller of the market item can cancel.
On success, the token will be transferred from the marketplace contract to the seller._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _marketItemId | uint256 | The id of market item that will be cancelled |

### createMarketSale

```solidity
function createMarketSale(uint256 _marketItemId) external payable
```

Create market sale

_msg.value must be equal to price of market item + sale fee
On success, the token will be transferred from the marketplace contract to the buyer.
On success, the price will be transferred from the buyer to the seller.
On success, the sale fee will be transferred from buyer to the marketplace owner._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _marketItemId | uint256 | The id of market item that will be sold |

