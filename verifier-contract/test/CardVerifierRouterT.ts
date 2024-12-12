import { ethers } from "hardhat";
import { expect } from "chai";

import {
    CardVerifierRouter,
    CardVerifier
} from '../typechain-types';


const proofA: any = [
  '0x0fe79a65253571300924c141b4cd9f6bdab9078d605f4a52ab86f39fabe9b08c',
  '0x205ebf8cdc6a1ad07930849b363150d4c19ea627d1c64568787a3e0135ef13c8'
]

const proofB: any = [
  [
    '0x2749af972ae8421d650ad3d2f90692264a953fe0187fffecd3f526a138725764',
    '0x2392ea6434d1bce0b9499ff0fd291cfe20553d7236efa0d65ddacaab3ce322eb'
  ],
  [
    '0x254a65b4619a4071af6f53255090373fbe6f46e4aaa653637a767377757e708e',
    '0x063c629d46eedd4d58488d112a81aa5cf106bde5b36743f7ac3719b7ab0faa8a'
  ]
]

const proofC: any = [
  '0x2559c1d15395fd1a184fcd583c1b17c62c1cedab06acb938329142971610a93e',
  '0x122c05c3eaf591bb28ad06fff14c7476580d0b85a7c64dbf7ea42bf0fb808034'
]

const publicSignals: any = [
  '0x0a295629f4df155d579f2714da4c7e47ebf2f1d79de41c7dc9a81c46feae439c',
  '0x2eb026d514ecb68f084f81de3fdb82e8866c440a7eae33c8f664429c6ecc3dac'
]

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
        const txHashed = "thisiscartcommitment";
        const amount = 500;
        await cardVerifierRouter.connect(admin1).addTransactionHashedInfo(
            txHashed,
            amount
        )
        // 1 mean pending tx 
        expect(await cardVerifierRouter.checkTransactionValid(txHashed)).to.equal(1);

        await cardVerifierRouter.connect(user).verifyTransaction(
            txHashed, 
            proofA, 
            proofB, 
            proofC, 
            publicSignals
        )
        // 3 approve tx
        expect(await cardVerifierRouter.checkTransactionValid(txHashed)).to.equal(3); 

        const Transacts = await cardVerifierRouter.connect(user)["selfTransacts()"]();
        console.log(Transacts)
    })
})