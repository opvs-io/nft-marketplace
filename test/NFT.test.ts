import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';

import { NFT, Marketplace } from '../typechain-types';

describe('NFT', function () {
    let nftContract: NFT;
    let marketplaceContract: Marketplace;
    let owner: SignerWithAddress;
    let bob: SignerWithAddress;
    let alice: SignerWithAddress;

    async function deployContract() {
        [owner, bob, alice] = await ethers.getSigners();

        const Marketplace = await ethers.getContractFactory('Marketplace');
        marketplaceContract = await Marketplace.deploy();

        await marketplaceContract.deployed();

        const NFT = await ethers.getContractFactory('NFT');
        nftContract = await NFT.deploy();

        nftContract.connect(owner).setApprovalForAll(marketplaceContract.address, true);
        nftContract.connect(bob).setApprovalForAll(marketplaceContract.address, true);
        nftContract.connect(alice).setApprovalForAll(marketplaceContract.address, true);

        await nftContract.deployed();
    }

    beforeEach(deployContract);

    async function mintToken(minter: SignerWithAddress, tokenURI: string = '', returns: boolean = false) {
        if (returns) {
            await nftContract.connect(minter).mint(tokenURI);
            return nftContract.tokenId();
        }

        return nftContract.connect(minter).mint(tokenURI);
    }

    describe('Views', function () {
        it('Should return owned tokens', async function () {
            const expectedOwnedTokens = [];

            const tokenId = (await mintToken(owner, '', true)) as BigNumber;
            expectedOwnedTokens.push(tokenId);

            const ownedTokens = await nftContract.getOwnedTokens();

            expect(ownedTokens).to.be.deep.equal(expectedOwnedTokens);
        });

        it('Should return created tokens', async function () {
            const expectedCreatedTokens = [];

            const tokenId = (await mintToken(owner, '', true)) as BigNumber;
            expectedCreatedTokens.push(tokenId);

            await mintToken(bob);

            const createdTokens = await nftContract.getCreatedTokens();

            expect(createdTokens).to.be.deep.equal(expectedCreatedTokens);
        });
    });

    describe('Minting', function () {
        it('Should increment tokenId by 1 when minting is successful', async function () {
            const tokenId = await mintToken(owner, '', true);

            const expectedTokenId = 1;

            expect(tokenId).to.be.equal(expectedTokenId);
        });

        it('Should set tokenURI when minting is successful', async function () {
            const expectedTokenURI = 'test-token-uri';

            const tokenId = (await mintToken(owner, expectedTokenURI, true)) as BigNumber;

            const tokenURI = await nftContract.tokenURI(tokenId);

            expect(tokenURI).to.be.equal(expectedTokenURI);
        });

        it('Should increment balance of owner by 1 when minting is successful', async function () {
            let expectedBalance = 0;

            await mintToken(owner);
            expectedBalance++;

            const balanceOfOwner = await nftContract.balanceOf(owner.address);

            expect(balanceOfOwner).to.be.equal(expectedBalance);
        });

        it('Should set the right owner for minted token', async function () {
            const tokenId = (await mintToken(owner, '', true)) as BigNumber;

            const ownerAddress = await nftContract.ownerOf(tokenId);

            expect(ownerAddress).to.be.equal(owner.address);
        });
    });
});
