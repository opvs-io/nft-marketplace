import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

import { NFT, Marketplace } from '../typechain-types';

describe('Marketplace', function () {
  let nftContract: NFT;
  let marketplaceContract: Marketplace;
  let owner: SignerWithAddress;
  let bob: SignerWithAddress;
  let alice: SignerWithAddress;

  const price = ethers.utils.parseEther('1');
  const saleFeePercentage = 1;

  async function deployContracts() {
    [owner, bob, alice] = await ethers.getSigners();

    const Marketplace = await ethers.getContractFactory('Marketplace');
    marketplaceContract = await Marketplace.deploy();
    await marketplaceContract.deployed();

    const NFT = await ethers.getContractFactory('NFT');
    nftContract = await NFT.deploy();

    await nftContract.deployed();

    nftContract.connect(owner).setApprovalForAll(marketplaceContract.address, true);
    nftContract.connect(bob).setApprovalForAll(marketplaceContract.address, true);
    nftContract.connect(alice).setApprovalForAll(marketplaceContract.address, true);
  }

  beforeEach(deployContracts);

  async function mintToken(minter: SignerWithAddress) {
    const tokenURI = '';
    await nftContract.connect(minter).mint(tokenURI);
    const tokenId = await nftContract.connect(minter).tokenId();
    return tokenId;
  }

  async function createMarketItem(price: BigNumber, tokenId: BigNumber, seller: SignerWithAddress) {
    return marketplaceContract.connect(seller).createMarketItem(nftContract.address, price, tokenId);
  }

  async function cancelMarketItem(marketItemId: BigNumber, canceller: SignerWithAddress) {
    return marketplaceContract.connect(canceller).cancelMarketItem(marketItemId);
  }

  async function createMarketSale(price: BigNumber, marketItemId: BigNumber, buyer: SignerWithAddress) {
    const value = price.add(price.mul(saleFeePercentage).div(100));

    return marketplaceContract.connect(buyer).createMarketSale(marketItemId, {
      value,
    });
  }

  describe('Market Items', function () {
    describe('Views', function () {
      it('Should return market items that are on sale', async function () {
        let expectedNumberOfItemsOnSale = 0;
        let marketItemId;

        const tokenId = await mintToken(owner);

        await createMarketItem(price, tokenId, owner);
        marketItemId = await marketplaceContract.marketItemId();
        expectedNumberOfItemsOnSale++;

        await createMarketSale(price, marketItemId, bob);
        expectedNumberOfItemsOnSale--;

        await createMarketItem(price, tokenId, bob);
        marketItemId = await marketplaceContract.marketItemId();
        expectedNumberOfItemsOnSale++;

        await cancelMarketItem(marketItemId, bob);
        expectedNumberOfItemsOnSale--;

        await createMarketItem(price, tokenId, bob);
        expectedNumberOfItemsOnSale++;

        const marketItemsOnSale = await marketplaceContract.getOnSaleMarketItems();

        expect(marketItemsOnSale.length).to.be.equal(expectedNumberOfItemsOnSale);
      });
    });

    describe('Create Market Item', function () {
      it('Should increment marketItemId by 1 when create market item is successful', async function () {
        const tokenId = await mintToken(owner);

        await createMarketItem(price, tokenId, owner);

        const marketItemId = await marketplaceContract.marketItemId();

        const expectedMarketItemId = 1;

        expect(marketItemId).to.be.equal(expectedMarketItemId);
      });

      it('Should revert create market item when nft contract is paused', async function () {
        const tokenId = await mintToken(owner);

        await nftContract.connect(owner).pause();

        const transaction = createMarketItem(price, tokenId, owner);

        const expectedRevertMessage = 'ERC721Pausable: token transfer while paused';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });

      it('Should revert if create market item with not owned token', async function () {
        const tokenId = await mintToken(bob);

        const transaction = createMarketItem(price, tokenId, owner);

        const expectedRevertMessage = 'ERC721: transfer from incorrect owner';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });

      it('Should revert if price is not greater than zero', async function () {
        const tokenId = await mintToken(owner);

        const invalidPrice = ethers.utils.parseEther('0');

        const transaction = createMarketItem(invalidPrice, tokenId, owner);

        const expectedRevertMessage = 'Price must be greater than zero';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });
    });

    describe('Cancel Market Item', function () {
      it('Should cancel market item', async function () {
        const tokenId = await mintToken(owner);

        await createMarketItem(price, tokenId, owner);
        const marketItemId = await marketplaceContract.marketItemId();

        await cancelMarketItem(marketItemId, owner);

        const tokenOwner = await nftContract.ownerOf(tokenId);

        expect(tokenOwner).to.be.equal(owner.address);
      });

      it('Should revert cancel market item when nft contract is paused', async function () {
        const tokenId = await mintToken(owner);

        await createMarketItem(price, tokenId, owner);
        const marketItemId = await marketplaceContract.marketItemId();

        await nftContract.connect(owner).pause();

        const transaction = cancelMarketItem(marketItemId, owner);

        const expectedRevertMessage = 'ERC721Pausable: token transfer while paused';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });

      it('Should revert cancel market item if not the seller', async function () {
        const tokenId = await mintToken(owner);

        await createMarketItem(price, tokenId, owner);
        const marketItemId = await marketplaceContract.marketItemId();

        const transaction = cancelMarketItem(marketItemId, bob);

        const expectedRevertMessage = 'You are not the seller';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });

      it('Should revert cancel market item if item does not exist', async function () {
        const invalidMarketItemId = ethers.BigNumber.from(2);

        const transaction = cancelMarketItem(invalidMarketItemId, bob);

        const expectedRevertMessage = 'Market item does not exist';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });
    });

    describe('Create Market Sale', function () {
      it('Should create market sale successfully', async function () {
        const seller = bob;
        const buyer = alice;

        const tokenId = await mintToken(seller);

        await createMarketItem(price, tokenId, seller);
        const marketItemId = await marketplaceContract.marketItemId();

        const initialEthBalanceOfOwner = await owner.getBalance();
        const initialEthBalanceOfSeller = await seller.getBalance();

        await createMarketSale(price, marketItemId, buyer);

        const saleFee = price.mul(saleFeePercentage).div(100);

        const expectedFinalEthBalanceOfOwner = initialEthBalanceOfOwner.add(saleFee);
        const expectedFinalEthBalanceOfSeller = initialEthBalanceOfSeller.add(price);

        const expectedFinalNftBalanceOfBuyer = 1;

        // it should transfer listing fee price to the contract owner
        expect(await owner.getBalance()).to.be.equal(expectedFinalEthBalanceOfOwner);

        // it should transfer price to the seller
        expect(await seller.getBalance()).to.be.equal(expectedFinalEthBalanceOfSeller);

        // it should transfer NFT to buyer
        expect(await nftContract.balanceOf(buyer.address)).to.be.equal(expectedFinalNftBalanceOfBuyer);
      });

      it('Should revert create market sale when nft contract is paused', async function () {
        const tokenId = await mintToken(owner);

        await createMarketItem(price, tokenId, owner);
        const marketItemId = await marketplaceContract.marketItemId();

        await nftContract.connect(owner).pause();

        const transaction = createMarketSale(price, marketItemId, bob);

        const expectedRevertMessage = 'ERC721Pausable: token transfer while paused';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });

      it('Should revert create market sale when buyer is seller', async function () {
        const tokenId = await mintToken(owner);

        await createMarketItem(price, tokenId, owner);
        const marketItemId = await marketplaceContract.marketItemId();

        const transaction = createMarketSale(price, marketItemId, owner);

        const expectedRevertMessage = 'You cannot buy your market item';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });

      it('Should revert if market item is not on sale', async function () {
        const tokenId = await mintToken(owner);

        await createMarketItem(price, tokenId, owner);
        const marketItemId = await marketplaceContract.marketItemId();

        await cancelMarketItem(marketItemId, owner);

        const transaction = createMarketSale(price, marketItemId, bob);

        const expectedRevertMessage = 'Market item is not on sale';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });

      it('Should revert if price is not equal', async function () {
        const seller = bob;
        const buyer = alice;

        const tokenId = await mintToken(seller);

        await createMarketItem(price, tokenId, seller);
        const marketItemId = await marketplaceContract.marketItemId();

        const invalidPrice = ethers.utils.parseEther('2');
        const transaction = createMarketSale(invalidPrice, marketItemId, buyer);

        const expectedRevertMessage = 'Value must be equal to price + saleFee';

        await expect(transaction).to.be.revertedWith(expectedRevertMessage);
      });
    });
  });
});
