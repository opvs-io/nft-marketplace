import { ethers } from 'hardhat';

async function main() {
  const Marketplace = await ethers.getContractFactory('Marketplace');
  const marketplace = await Marketplace.deploy();

  await marketplace.deployed();

  const NFT = await ethers.getContractFactory('NFT');
  const nft = await NFT.deploy();

  await nft.deployed();

  console.log('Marketplace is deployed on', marketplace.address);
  console.log('NFT is deployed on', nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
