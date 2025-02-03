// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { ICardVerifier } from "./ICardVerifier.sol"; 

enum EStatus {
  Unknown,    // 0 
  Pending,    // 1 
  Rejected,   // 2 
  Approved    // 3 
}

struct TransactionInfo {
  uint64 amount;
  bytes32 hashedNounce;
  EStatus status;
}

contract CardVerifierRouter {
    ICardVerifier public immutable verifier;   
    address public admin1;
    // Placeholder for development admin2
    address public admin2;
    mapping (bytes32 => TransactionInfo) public transactionHashedToDetails;  
    mapping (address => bytes32[]) walletToTransactionHashed;
    event VerifyLog(address indexed prover, bytes32 txHashed, bool proof);
    event EnrollTransactionHashed(bytes32 txHashed, uint amount, bytes32 nounceHashed);

    modifier OnlyAdmin() {
        require(msg.sender == admin1 || msg.sender == admin2, "only admin");
        _;
    }

    constructor(ICardVerifier _verifier) {
        verifier = _verifier;    
        admin1 = msg.sender;
    }

    function verifyTransaction(
        bytes32 _transactionHashed,
        uint[2] calldata p_a,
        uint[2][2] calldata p_b,
        uint[2] calldata p_c,
        uint[3] calldata pub_output
    ) public {
        TransactionInfo storage _txInfo = transactionHashedToDetails[_transactionHashed];
        require(_txInfo.status != EStatus.Approved, "Transaction already verified."); 
        require(_txInfo.status != EStatus.Unknown,"Invalid transaction nerver exist.");
        require(_txInfo.hashedNounce == bytes32(pub_output[2]),"Invalid expected nonce");  
              
        bool proof = verifier.verifyProof(p_a, p_b, p_c, pub_output);
        transactionHashedToDetails[_transactionHashed].status = proof ? EStatus.Approved : EStatus.Rejected;

        emit VerifyLog(msg.sender, _transactionHashed, proof);
        walletToTransactionHashed[msg.sender].push(_transactionHashed);
    }

    function addTransactionHashedInfo(
        bytes32 _transactionHashed,
        uint64 _amount,
        bytes32 _hashedNounce
    ) external OnlyAdmin{
        require(transactionHashedToDetails[_transactionHashed].status == EStatus.Unknown,"Transaction already exists");

        transactionHashedToDetails[_transactionHashed] = TransactionInfo({
          amount: _amount,
          status: EStatus.Pending,
          hashedNounce: _hashedNounce
        });
        emit EnrollTransactionHashed(_transactionHashed, _amount,_hashedNounce);
    }

    function getTransactionStatus(bytes32 _transactionHashed) public view returns (EStatus) {
        return transactionHashedToDetails[_transactionHashed].status;
    }

    function getUserTransactions() public view returns(bytes32[] memory){
        return walletToTransactionHashed[msg.sender]; 
    }

    function getUserTransactions(address walletAddress) public view returns(bytes32[] memory ){
        return walletToTransactionHashed[walletAddress]; 
    }

    function setAdmin(address _admin2) public OnlyAdmin {
        admin2 = _admin2;
    }
}