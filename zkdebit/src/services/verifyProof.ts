'use server'
import { ethers } from "ethers";

import {
  cardVerifierContractAbi,
  cardVerifierRouterContractAbi
} from "@/utils/contractAbi";

interface IFormattedProof {
  pi_a: [bigint, bigint]; // Array with two string elements
  pi_b: [[bigint, bigint], [bigint, bigint]]; // Nested arrays with string elements
  pi_c: [bigint, bigint]; // Array with two string elements
  public_signals: bigint[]; // Array of strings
}

export default async function VerifyProof(
  txHashed: string,
  formatted_proof: IFormattedProof
){
    const provider = new ethers.JsonRpcProvider(process.env.RPC_SEPOLIA);
    
    const wallet_private_key = process.env.PROVER_PRIVATE_KEY_SEPOLIA;
    const contract_address =  process.env.CARDVERIFIER_ROUTER_CONTRACT;
    if (!wallet_private_key || !contract_address) {
        throw new Error("WALLET_PRIVATE_KEY is not defined in the environment variables.");
    }

    const wallet = new ethers.Wallet(wallet_private_key,provider);
    const contract = new ethers.Contract(
      contract_address,
      cardVerifierRouterContractAbi,
      wallet
    );
    console.log(txHashed)
    console.log(formatted_proof.public_signals[2])
    console.log(formatted_proof)
    const response = await contract.verifyTransaction(
      txHashed,
      formatted_proof.pi_a,
      formatted_proof.pi_b,
      formatted_proof.pi_c,
      formatted_proof.public_signals,
      {
        gasLimit: 3000000 // Add explicit gas limit
      }
    )
    
    return response
}