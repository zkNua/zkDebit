import { ethers } from "hardhat";
import { expect } from "chai";

import {
    CardVerifierRouter,
    CardVerifier
} from '../typechain-types';

const Proofs :any = {
  "pi_a": [
    "0x2da1d0e51fb2e86818c204893fb7143144aa85a05bdf75b6ace38b81d85a380a",
    "0x00ac5dfac59fd43001b6c847c04b3f802cef4345ed2a9d1795559afd14c8136f"
  ],
  "pi_b": [
    [
      "0x035d81e5ef5199abd4fc52a872826970028ead4060eca8dc7c56927162ad8e60",
      "0x001224a9e23677785357ed1e06a75d597fbd0ec0f0843e4f8aa5be16ab9d5d71"
    ],
    [
      "0x2dce56926316a3fbe2f3045bbf7acb76fc4418b351893d4dd4211754d2d49c4e",
      "0x27c7c11070029b2361f2355092d67d2ba83c37c7c7062bd834a530d4582e93cd"
    ]
  ],
  "pi_c": [
    "0x282d17d9b9d2db067af70d85f864c19b6a1d832739893eebe92427c946335879",
    "0x12595458e07ce5e26b96c26aef19f7a198013f1d76058547e742a1320d0eca13"
  ],
  "public": [
    "0x21ca69d01e33d961bd82d57b225fba692657b2dcbd094c75c8b8ba6faa481f65",
    "0x02f91b1036fa5a3e587b7da89d792b7e631c32cabf2179ddd00ef5322dc9115c",
    "0x1fbecfd87d0cdd9a90214add7fc074a49b50c692c4f641f59ba1ab160b8f0849"
  ]
}

describe("CardVerifier",function (){
    let cardVerifier : CardVerifier; 
    let cardVerifierRouter : CardVerifierRouter;
    let admin1 : any; 
    let admin2 : any;
    let user : any;

    beforeEach("Deploying contract",async function (){
        [admin1 , admin2, user] = await ethers.getSigners();
        const deployer = await ethers.getSigners();
        console.log(`Deploying contracts with the account: ${deployer[1].address}`);

        // Deploy the ICardVerifier mock contract
        const CardVerifier = await ethers.getContractFactory("CardVerifier",admin1);
        cardVerifier = (await CardVerifier.deploy()) as unknown as CardVerifier;
        await cardVerifier.waitForDeployment();
        console.log("CardVerifier deployed at:", await cardVerifier.getAddress());
      
        // Deploy the CardVerifierRouter with the ICardVerifier address as a constructor argument
        const CardVerifierRouter = await ethers.getContractFactory("CardVerifierRouter",admin1);
        cardVerifierRouter = (await CardVerifierRouter.deploy(await cardVerifier.getAddress())) as unknown as CardVerifierRouter;
        await cardVerifierRouter.waitForDeployment();
        console.log("CardVerifierRouter deployed at:", await cardVerifierRouter.getAddress());
    })

    it("should set the admin 1 address", async function () {
        expect(await cardVerifierRouter.admin1()).to.equal(admin1.address);
    });

    it("shoule set the admin 2 address & only admin would be able to set admin access", async function (){
        await cardVerifierRouter.connect(admin1).setAdmin(admin2.address); 

        const newAdmin2 = await cardVerifierRouter.admin2();
        expect(newAdmin2).to.equal(admin2.address);    
    })

    it("Proof should valid computation & should stored to prover wallet",async function (){
        const txHashed = "0x563285f6448010975c613815e1363bcdee6f4569bf1e9cca5c390376fe1090c7";
        const amount = 500;
        const nonce = "0x1fbecfd87d0cdd9a90214add7fc074a49b50c692c4f641f59ba1ab160b8f0849"
        await cardVerifierRouter.connect(admin1).addTransactionHashedInfo(
            txHashed,
            amount,
            nonce
        )
        // 1 mean pending tx 
        expect(await cardVerifierRouter.getTransactionStatus(txHashed)).to.equal(1);

        await cardVerifierRouter.connect(user).verifyTransaction(
          txHashed,
          Proofs.pi_a,
          Proofs.pi_b,
          Proofs.pi_c,
          Proofs.public
        );

        // 3 approve tx
        expect(await cardVerifierRouter.getTransactionStatus(txHashed)).to.equal(3); 
        
        const Transacts = await cardVerifierRouter.connect(user)["getUserTransactions()"]();
    })
})