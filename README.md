# zk Debit 

Welcome to the **zk Debit** project! This guide will help you set up and test the application. Below, you'll find the structure of the project and detailed steps for running commands.

---
### ETH GLOBAL https://ethglobal.com/showcase/zkdebit-ypjir
---

## Project Structure

The project involves **3 main folders** in the Testing Poc flow:

1. **`Shop`**  
   Contains the smart contracts for zk Debit.

2. **`Bank`**  
   The user interface for interacting with zk Debit.

3. **`Verifier Contract`**  
   Handles API requests and facilitates off-chain computations.

---

## Prerequisites

Before running any commands, ensure the following:
- **Env**: Adding env config following the env.example
---

## Step-by-Step Testing

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/zkdebit.git
cd zkdebit
```

### 2. Starting Bank server
```bash 
cd Bank 
npm i --legacy-depedency 
node index.js
```

### 3. running shop to request for creating transaction hashed to bank to creating tx_hashed onchain
---
#### Changing some details in app/creating-tx to change hashed payload cause some tx hashed might already exist onchain. Check transaction hashed at this linked  function read function check transaction is valid 

https://sepolia.etherscan.io/address/0x1fbe30583563e7dd0473aa1d4de8f53483130b17#readContract 
---

open another terminal 
```bash 
cd shop 
npm i --legacy-depedency 
npm run dev
```

### 4. verify proof in from zkdebit temporary in verifier-contract folder
```
cd scripts
node verifyProof.ts
```
