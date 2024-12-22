export const cardVerifierRouterAbi = [
    {
      "inputs": [
        {
          "internalType": "contract ICardVerifier",
          "name": "_verifier",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "txHashed",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "EnrollTransactionHashed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "prover",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "txHashed",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "proof",
          "type": "bool"
        }
      ],
      "name": "VerifyLog",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_transactionHashed",
          "type": "string"
        },
        { "internalType": "uint256", "name": "_amount", "type": "uint256" }
      ],
      "name": "addTransactionHashedInfo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "admin1",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "admin2",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_transactionHashed",
          "type": "string"
        }
      ],
      "name": "checkTransactionValid",
      "outputs": [
        { "internalType": "enum EStatus", "name": "", "type": "uint8" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUserTransactions",
      "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "walletAddress", "type": "address" }
      ],
      "name": "getUserTransactions",
      "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_admin2", "type": "address" }
      ],
      "name": "setAdmin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "name": "transactionHashedToDetails",
      "outputs": [
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "enum EStatus", "name": "status", "type": "uint8" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "verifier",
      "outputs": [
        {
          "internalType": "contract ICardVerifier",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_transactionHashed",
          "type": "string"
        },
        { "internalType": "uint256[2]", "name": "p_a", "type": "uint256[2]" },
        {
          "internalType": "uint256[2][2]",
          "name": "p_b",
          "type": "uint256[2][2]"
        },
        { "internalType": "uint256[2]", "name": "p_c", "type": "uint256[2]" },
        {
          "internalType": "uint256[2]",
          "name": "pub_output",
          "type": "uint256[2]"
        }
      ],
      "name": "verifyTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  