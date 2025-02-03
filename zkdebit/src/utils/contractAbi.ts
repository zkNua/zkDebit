export const cardVerifierContractAbi = [
  {
    inputs: [
      { internalType: "uint256[2]", name: "_pA", type: "uint256[2]" },
      { internalType: "uint256[2][2]", name: "_pB", type: "uint256[2][2]" },
      { internalType: "uint256[2]", name: "_pC", type: "uint256[2]" },
      { internalType: "uint256[3]", name: "_pubSignals", type: "uint256[3]" },
    ],
    name: "verifyProof",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

export const cardVerifierRouterContractAbi = [
  {
    inputs: [
      {
        internalType: "contract ICardVerifier",
        name: "_verifier",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "txHashed",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "nounceHashed",
        type: "bytes32",
      },
    ],
    name: "EnrollTransactionHashed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prover",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "txHashed",
        type: "bytes32",
      },
      { indexed: false, internalType: "bool", name: "proof", type: "bool" },
    ],
    name: "VerifyLog",
    type: "event",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_transactionHashed", type: "bytes32" },
      { internalType: "uint64", name: "_amount", type: "uint64" },
      { internalType: "bytes32", name: "_hashedNounce", type: "bytes32" },
    ],
    name: "addTransactionHashedInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin1",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "admin2",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_transactionHashed", type: "bytes32" },
    ],
    name: "getTransactionStatus",
    outputs: [{ internalType: "enum EStatus", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserTransactions",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "walletAddress", type: "address" },
    ],
    name: "getUserTransactions",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_admin2", type: "address" }],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "transactionHashedToDetails",
    outputs: [
      { internalType: "uint64", name: "amount", type: "uint64" },
      { internalType: "bytes32", name: "hashedNounce", type: "bytes32" },
      { internalType: "enum EStatus", name: "status", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "verifier",
    outputs: [
      { internalType: "contract ICardVerifier", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_transactionHashed", type: "bytes32" },
      { internalType: "uint256[2]", name: "p_a", type: "uint256[2]" },
      { internalType: "uint256[2][2]", name: "p_b", type: "uint256[2][2]" },
      { internalType: "uint256[2]", name: "p_c", type: "uint256[2]" },
      { internalType: "uint256[3]", name: "pub_output", type: "uint256[3]" },
    ],
    name: "verifyTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
