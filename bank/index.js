const express = require('express');
const snarkjs = require('snarkjs');

const { ethers } = require('ethers');
const dotenv = require("dotenv");

dotenv.config();
const abi = require("./abi_bank.json");

const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
);

app.use(express.json());
const PORT = 4000;

// interface in api backend 
// mock response interface {message : "" , payload ""}
const ITransactionStatus = {
    Unknown: 0,
    Pending: 1,
    Rejected: 2,
    Approved: 3
};

// mock card with the balance 
let cardsDataBase = [
    {
        // user account
        walletAddress: '0x61532aB1dA425cFD60631b74ad2B990C8931a25D',
        card_number: '1234567890123456',
        balance: 0,
    },
    {
        // shop account
        card_number: '1234567890123457',
        balance: 0
    }
];

let cardAndProof = [
    {
        card_number: "4242424242424242424242",
        pi3: "01234567890"
    }
];

let transaction_log = [];
// 1. endpoint to send cardSetup.wasm and cardSetup_0000.zkey to the user
app.get('/user/request/card-setup', (req, res) => {
    res.zip([
        { path: './cardSetup_0000.zkey', name: 'cardSetup_0000.zkey' },
        { path: './cardSetup_js/cardSetup.wasm', name: 'cardSetup.wasm' }
    ]);
});

app.get("/transaction/log",(req,res)=>{
    res.json(transaction_log)
})

// 2. Endpoint to user send proof and verify the setup proof from PrivacyVisa and keep in bank backend 
app.post('/store-setup', async (req, res) => {
    const { proof, publicSignals, card_number } = req.body;
    // check that the card number is not already stored
    if (cardAndProof.find(card => card.card_number === card_number)) {
        console.log("Card already stored");
        res.status(400).json({ message: 'Card already stored', payload: "" });
        return;
    }
    try {
        const verificationKey = JSON.parse(fs.readFileSync("cardSetup_verification_key.json"));
        // Verify proof 
        const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
        if (isValid) {
            console.log("Setup proof verification successful");
            console.log("public ", publicSignals[1]);
            cardAndProof.push({ card_number: card_number, pi3: publicSignals[1] });
            res.status(200).json({ message: 'Proof verified and setup data stored', payload: "" });
        } else {
            console.log("Setup proof verification failed");
            res.status(400).json({ message: 'Invalid proof', payload: "" });
        }
    } catch (error) {
        console.error("Error during setup verification:", error);
        res.status(500).json({ message: 'Error during setup verification', payload: error.toString() });
    }
});

// 3. Endpoint to create a transaction order from shop initialize onchain
app.post('/create-transaction', async (req, res) => {
    const { pi3, amount, transaction_hashed } = req.body;
    // check that the user's card number is stored in cards offchain
    
    const exists = transaction_log.find(
        (transaction) => transaction.transaction_hashed === transaction_hashed
    );
    if (exists) {
        res.status(400).json({
            message: 'Transaction hashed is already declare tell shop re generate it',
            payload: ""
        });
        return;
    }
    const certain_card = cardAndProof.find(card => card.pi3 === pi3);
    if (!certain_card) {
        console.log("Card not found");
        res.status(400).json({ message: 'Card not found', payload: "" });
        return;
    }

    const response = await OnCreatingTransactionHashed(transaction_hashed, amount);
    if (response.status) {
        transaction_log.push({
            transaction_hashed,
            amount
        });
        console.log(transaction_log)
        return res.status(200).json({
            message: 'Transaction order created onchain',
            payload: transaction_hashed
        });
    }
    console.log("Invalid transactionorder!");
    return res.status(200).json({
        message: 'Invalid transaction order',
        payload: transaction_hashed
    })
});

// 4. Endpoint to send cardVerification.wasm and cardVerification_0000.zkey to the user for generating verify proof 
app.get('/user/request/card-verification', async (req, res) => {
    res.zip([
        { path: './cardVerification_0000.zkey', name: 'cardVerification_0000.zkey' },
        { path: './cardVerification_js/cardVerification.wasm', name: 'cardVerification.wasm' }
    ]);
});

// 5. Endpoint to check the transaction status
app.get('/shop/check-transaction', async (req, res) => {
    const { transaction_hashed } = req.query;
    const transactionInfo = await OnGetTransactionInfo(transaction_hashed);
    res.status(200).json({ status: transactionInfo.status });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Bank server is running on port ${PORT}`);
});

async function OnCreatingTransactionHashed(transaction_hashed, amount) {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
        const wallet_private_key = process.env.BANK_PRIVATE_KEY;
        const card_verifier_contract_address = process.env.CARD_VERIFIER_CONTRACT_ADDRESS
        if (!wallet_private_key || !card_verifier_contract_address) {
            throw new Error("WALLET_PRIVATE_KEY is not defined in the environment variables.");
        }
        const wallet = new ethers.Wallet(wallet_private_key, provider);
        const contract = new ethers.Contract(card_verifier_contract_address, abi, wallet);

        const response_tx = await contract.addTransactionHashedInfo(transaction_hashed, amount);
        await response_tx.wait(2);
        console.log("Transaction confirmed on-chain");
        return { status: true };
    } catch (error) {
        console.error("Error adding transaction:", error);
        return { status: false, error: error.message };
    }
}

async function OnGetTransactionInfo(transaction_hashed) {
    const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
    const card_verifier_contract_address = process.env.CARD_VERIFIER_CONTRACT_ADDRESS
    const contract = new ethers.Contract(card_verifier_contract_address, abi, provider);

    const TransactionInfo = await contract.transactionHashedToDetails(transaction_hashed);
    return {
        amount: Number(TransactionInfo.amount),
        status: Number(TransactionInfo.status)
    };
}