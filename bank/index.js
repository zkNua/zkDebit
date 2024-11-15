const express = require('express');

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

});

// 2. Endpoint to user send proof and verify the setup proof from PrivacyVisa and keep in bank backend 
app.post('/store-setup', async (req, res) => {
    const { proof, public_output, _card_number } = req.body;
    
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