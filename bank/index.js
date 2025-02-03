const { ethers } = require('ethers');
const express = require('express');
const snarkjs = require('snarkjs');
const circomlibjs = require("circomlibjs");
const crypto = require('crypto');
const fs = require('fs');
const cors = require('cors');
const router_abi = require('./router_abi.json');

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());

const PORT = 4000;

// Database file path
const DB_FILE = './db.json';

// Load database from JSON
function loadDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        return { cardsDataBase: [], cardAndProof: [], transaction_log: [], transaction_nonce: [] };
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
}

// Save database to JSON
function saveDatabase(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Load the database
let db = loadDatabase();

const generateRandomNonce = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashStringToBigInt = (input) => {
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    return BigInt('0x' + hash).toString();
};

async function generatingPoseidonHash(secret) {
    const secretBigInt = hashStringToBigInt(secret);
    const poseidon = await circomlibjs.buildPoseidon();
    const hash = poseidon.F.toObject(poseidon([secretBigInt]));
    return "0x" + BigInt(hash).toString(16);
}

// 1️⃣ Request Card Setup Files
app.get('/user/request/card-setup', (req, res) => {
    res.zip([{ path: './cardSetup_0000.zkey', name: 'cardSetup_0000.zkey' }, { path: './cardSetup_js/cardSetup.wasm', name: 'cardSetup.wasm' }]);
});

// 2️⃣ Store Setup Proofs
app.post('/store-setup', async (req, res) => {
    const { proof, publicSignals, card_number } = req.body;

    if (db.cardAndProof.find(card => card.card_number === card_number)) {
        return res.status(400).json({ message: 'Card already stored' });
    }

    try {
        const verificationKey = JSON.parse(fs.readFileSync("cardSetup_verification_key.json"));
        const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);

        if (isValid) {
            db.cardAndProof.push({ card_number, pi3: publicSignals[1] });
            saveDatabase(db);
            res.status(200).json({ message: 'Proof verified and setup data stored' });
        } else {
            res.status(400).json({ message: 'Invalid proof' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error during setup verification', error: error.toString() });
    }
});

// 3️⃣ Create Transaction Order
app.post('/create-transaction', async (req, res) => {
    const { pi3, amount, transaction_hashed } = req.body;
    if (db.transaction_log.find(tx => tx.transaction_hashed === transaction_hashed)) {
        return res.status(400).json({ message: 'Transaction already exists' });
    }

    const certain_card = db.cardAndProof.find(card => card.pi3 === pi3);
    if (!certain_card) return res.status(400).json({ message: 'Card not found' });

    const nonce = generateRandomNonce();
    const poseidon_nonce = await generatingPoseidonHash(nonce);
    const nonce_bytes = ethers.toBeHex(poseidon_nonce);
    const response = await OnCreatingTransactionHashed(transaction_hashed, amount, nonce_bytes);

    if (response.status) {
        db.transaction_log.push({ transaction_hashed, amount });
        db.transaction_nonce.push({ transaction_hashed, nonce });
        saveDatabase(db);

        return res.status(200).json({ message: 'Transaction order created on-chain', payload: transaction_hashed });
    }

    return res.status(400).json({ message: 'Invalid transaction order' });
});

// 4️⃣ Request Card Verification Files
app.get('/user/request/card-verification', (req, res) => {
    res.zip([{ path: './cardVerification_0000.zkey', name: 'cardVerification_0000.zkey' }, { path: './cardVerification_js/cardVerification.wasm', name: 'cardVerification.wasm' }]);
});

// 5️⃣ Check Transaction Status
app.get('/shop/check-transaction', async (req, res) => {
    const { transaction_hashed } = req.query;
    const transactionInfo = await OnGetTransactionInfo(transaction_hashed);
    res.status(200).json({ status: transactionInfo.status });
});

// 6️⃣ Get All Transactions
app.get("/transaction/log", (req, res) => {
    res.json(db.transaction_log);
});

// 🚀 Start Server
app.listen(PORT, () => console.log(`Bank server is running on port ${PORT}`));

// 📌 OnChain Transaction Handling
async function OnCreatingTransactionHashed(transaction_hashed, amount, hashed_nonce) {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
        const wallet_private_key = process.env.BANK_PRIVATE_KEY;
        const card_verifier_contract_address = process.env.CARD_VERIFIER_ROUTER_CONTRACT_ADDRESS;

        if (!wallet_private_key || !card_verifier_contract_address) throw new Error("Missing environment variables.");

        const wallet = new ethers.Wallet(wallet_private_key, provider);
        const contract = new ethers.Contract(card_verifier_contract_address, router_abi, wallet);
        const response_tx = await contract.addTransactionHashedInfo(transaction_hashed, amount, hashed_nonce);
        await response_tx.wait(3);

        console.log("Transaction confirmed on-chain");
        return { status: true };
    } catch (error) {
        console.error("Error adding transaction:", error);
        return { status: false, error: error.message };
    }
}

// 📌 Get Transaction Info
async function OnGetTransactionInfo(transaction_hashed) {
    const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
    const card_verifier_contract_address = process.env.CARD_VERIFIER_ROUTER_CONTRACT_ADDRESS;
    const contract = new ethers.Contract(card_verifier_contract_address, router_abi, provider);
    
    const TransactionInfo = await contract.transactionHashedToDetails(transaction_hashed);
    console.log(TransactionInfo)
    return { amount: Number(TransactionInfo.amount), status: Number(TransactionInfo.status), hashed_nonce: TransactionInfo.hashedNonce };
}