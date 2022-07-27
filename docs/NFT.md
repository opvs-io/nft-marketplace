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

### tokenURI

```solidity
function tokenURI(uint256 _tokenId) public view virtual returns (string)
```

### pause

```solidity
function pause() public virtual
```

### unpause

```solidity
function unpause() public virtual
```

### _burn

```solidity
function _burn(uint256 _tokenId) internal virtual
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId) internal virtual
```

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

### tokenURI

```solidity
function tokenURI(uint256 _tokenId) public view virtual returns (string)
```

### pause

```solidity
function pause() public virtual
```

_Pauses all token transfers, only owner can call this function_

### unpause

```solidity
function unpause() public virtual
```

_Unpauses all token transfers, only owner can call this function_

### _burn

```solidity
function _burn(uint256 _tokenId) internal virtual
```

_Override_

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId) internal virtual
```

_Override_

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

