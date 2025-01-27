import { cardVerifierRouterAbi } from './assets/cardVerifierRouterAbi';

import { ethers } from "hardhat"


const proofA: any = [
  "0x0fe79a65253571300924c141b4cd9f6bdab9078d605f4a52ab86f39fabe9b08c",
  "0x205ebf8cdc6a1ad07930849b363150d4c19ea627d1c64568787a3e0135ef13c8",
];

const proofB: any = [
  [
    "0x2749af972ae8421d650ad3d2f90692264a953fe0187fffecd3f526a138725764",
    "0x2392ea6434d1bce0b9499ff0fd291cfe20553d7236efa0d65ddacaab3ce322eb",
  ],
  [
    "0x254a65b4619a4071af6f53255090373fbe6f46e4aaa653637a767377757e708e",
    "0x063c629d46eedd4d58488d112a81aa5cf106bde5b36743f7ac3719b7ab0faa8a",
  ],
];

const proofC: any = [
  "0x2559c1d15395fd1a184fcd583c1b17c62c1cedab06acb938329142971610a93e",
  "0x122c05c3eaf591bb28ad06fff14c7476580d0b85a7c64dbf7ea42bf0fb808034",
];

const publicSignals: any = [
  "0x0a295629f4df155d579f2714da4c7e47ebf2f1d79de41c7dc9a81c46feae439c",
  "0x2eb026d514ecb68f084f81de3fdb82e8866c440a7eae33c8f664429c6ecc3dac",
];

async function verifyProof(txHashed : string){
    const provider = new ethers.JsonRpcProvider(process.env.RPC_SEPOLIA);
    
    const wallet_private_key = process.env.PROVER_PRIVATE_KEY_SEPOLIA;
    const contract_address =  process.env.CARDVERIFIER_CONTRACT;
    if (!wallet_private_key || !contract_address) {
        throw new Error("WALLET_PRIVATE_KEY is not defined in the environment variables.");
    }

    const wallet = new ethers.Wallet(wallet_private_key, provider);
    const contract = new ethers.Contract(contract_address, cardVerifierRouterAbi, wallet);

    await contract.verifyTransaction(
        txHashed, 
        proofA, 
        proofB, 
        proofC, 
        publicSignals
    )
    
}

verifyProof("b5583627c5a9bbf40397fdcb6ab8b15f2025ac7b0a047720c84a8b9409750ad6");