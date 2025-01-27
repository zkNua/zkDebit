import { ethers } from "hardhat"


async function main() {
    const deployer = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer[0].address}`);

    // Deploy the ICardVerifier mock contract
    const CardVerifier = await ethers.getContractFactory("CardVerifier",deployer[1]);
    const cardVerifier = await CardVerifier.connect(deployer[1]).deploy();
    await cardVerifier.waitForDeployment();
    console.log("CardVerifier deployed at:", await cardVerifier.getAddress());
  
    // Deploy the CardVerifierRouter with the ICardVerifier address as a constructor argument
    const CardVerifierRouter = await ethers.getContractFactory("CardVerifierRouter",deployer[1]);
    const cardVerifierRouter = await CardVerifierRouter.deploy(await cardVerifier.getAddress());
    await cardVerifierRouter.waitForDeployment();
    console.log("CardVerifierRouter deployed at:", await cardVerifierRouter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});