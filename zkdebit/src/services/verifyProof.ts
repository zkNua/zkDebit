'use server'
import { ethers } from "ethers";

import { VerifierContractAbi } from "@/utils/testVerifierAbi";

interface IFormattedProof {
  pi_a: [string, string]; // Array with two string elements
  pi_b: [[string, string], [string, string]]; // Nested arrays with string elements
  pi_c: [string, string]; // Array with two string elements
  public_signals: string[]; // Array of strings
}

export default async function VerifyProof(
  txHashed: string,
  formatted_proof: IFormattedProof
){
    const provider = new ethers.JsonRpcProvider(process.env.RPC_SEPOLIA);
    
    const wallet_private_key = process.env.PROVER_PRIVATE_KEY_SEPOLIA;
    const contract_address =  process.env.CARDVERIFIERR_CONTRACT;
    if (!wallet_private_key || !contract_address) {
        throw new Error("WALLET_PRIVATE_KEY is not defined in the environment variables.");
    }

    const wallet = new ethers.Wallet(wallet_private_key, provider);
    const contract = new ethers.Contract(contract_address, VerifierContractAbi, wallet);

    // console.log(txHashed)
    const response = await contract.verifyProof(
        formatted_proof.pi_a, 
        formatted_proof.pi_b, 
        formatted_proof.pi_c, 
        formatted_proof.public_signals
    )
    return response
}