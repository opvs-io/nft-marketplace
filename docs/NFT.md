# Solidity API

## NFT

### tokenId

```solidity
uint256 tokenId
```

### _tokenIdToCreatorAddress

```solidity
mapping(uint256 => address) _tokenIdToCreatorAddress
```

### constructor

```solidity
constructor() public
```

### getOwnedTokens

```solidity
function getOwnedTokens() public view returns (uint256[])
```

Get all of owned tokens by msg.sender

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | _ownedTokens An array of token ids that are owned by msg.sender |

### getCreatedTokens

```solidity
function getCreatedTokens() public view returns (uint256[])
```

Get all of the created tokens by msg.sender

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | _createdTokens An array of token ids that are created by msg.sender |

### mint

```solidity
function mint(string _tokenURI) external returns (uint256)
```

Mint new token

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenURI | string | The URI of token that holds metadata of the token |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | _tokenId The id of new token |

