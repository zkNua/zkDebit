const express = require('express');
const snarkjs  = require('snarkjs') ; 

const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
const PORT = 4000;

// mock card with the balance 
let cardsDataBase = [
    {
        // user account
        card_number: '1234567890123456',
        balance: 1000,
    },
    {
        // shop account
        card_number: '1234567890123457',
        balance: 0
    }
];

let cardAndProof = [];

// 1. endpoint to send cardSetup.wasm and cardSetup_0000.zkey to the user
app.get('/user/request/card-setup', (req, res) => {
    res.zip([
        { path: './cardSetup_0000.zkey', name: 'cardSetup_0000.zkey' },
        { path: './cardSetup_js/cardSetup.wasm', name: 'cardSetup.wasm' }
    ]);
});

// 2. Endpoint to user send proof and verify the setup proof from PrivacyVisa and keep in bank backend 
app.post('/store-setup', async (req, res) => {
    const { proof, publicSignals, card_number } = req.body;
    // check that the card number is not already stored
    if (cardAndProof.find(card => card.card_number === card_number)) {
        console.log("Card already stored");
        res.status(400).json({ message: 'Card already stored', payload : "" });
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
            res.status(200).json({ message: 'Proof verified and setup data stored' , payload : "" });
        } else {
            console.log("Setup proof verification failed");
            res.status(400).json({ message: 'Invalid proof', payload : "" });
        }
    } catch (error) {
        console.error("Error during setup verification:", error);
        res.status(500).json({ message: 'Error during setup verification', payload : error.toString() });
    }
});

// 3. Endpoint to create a transaction order from shop initialize onchain
app.post('/create-transaction', async (req, res) => {

});

// 4. Endpoint to send cardVerification.wasm and cardVerification_0000.zkey to the user for generating verify proof 
app.get('/user/request/card-verification', (req, res) => {

});

// 5. Endpoint to check the transaction status
app.get('/shop/check-transaction/:transaction_hashed', async (req, res) => {
    const { transaction_hashed } = req.params;

});

// Start the server
app.listen(PORT, () => {
    console.log(`Bank server is running on port ${PORT}`);
});