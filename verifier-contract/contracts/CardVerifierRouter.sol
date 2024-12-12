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
  uint amount;
  EStatus status;
}
contract CardVerifierRouter {
  ICardVerifier public immutable verifier;   
  address public admin1;
  // Placeholder for development admin2
  address public admin2;

  mapping (string => TransactionInfo) public transactionHashedToDetails;  
  mapping (address => string[]) walletToTransactionHashed;
  
  event VerifyLog(address indexed verifier, string txHashed, bool proof);
  event EnrollTransactionHashed(string txHashed, uint amount);

  constructor(ICardVerifier _verifier) {
    verifier = _verifier;    
    admin1 = msg.sender;
  }

  function verifyTransaction(
    string memory _transactionHashed,
    uint[2] calldata p_a,
    uint[2][2] calldata p_b,
    uint[2] calldata p_c,
    uint[2] calldata pub_output
  ) public {
    require(
      transactionHashedToDetails[_transactionHashed].status != EStatus.Approved, 
      "Transaction already verified."
    ); 
    require(
      transactionHashedToDetails[_transactionHashed].status != EStatus.Unknown,
      "Invalid transaction nerver exist."
    );

    bool proof = verifier.verifyProof(p_a, p_b, p_c, pub_output);
    require(proof, "Invalid proof.");
    if (proof) {
      transactionHashedToDetails[_transactionHashed].status = EStatus.Approved;
    }
    else {
      transactionHashedToDetails[_transactionHashed].status = EStatus.Rejected; 
    }
    emit VerifyLog(msg.sender, _transactionHashed, proof);
    walletToTransactionHashed[msg.sender].push(_transactionHashed);
  }   

  function addTransactionHashedInfo(
    string memory _transactionHashed,
    uint _amount
  ) external {
    require(msg.sender == admin1 || msg.sender == admin2, 'only admin');
    transactionHashedToDetails[_transactionHashed] = TransactionInfo({
      amount: _amount,
      status: EStatus.Pending
    });

    emit EnrollTransactionHashed(_transactionHashed, _amount);
  }

  function checkTransactionValid (
    string memory _transactionHashed
  ) public view returns(EStatus){
    return transactionHashedToDetails[_transactionHashed].status; 
  }

  function selfTransacts() public view returns( string[] memory){
    return walletToTransactionHashed[msg.sender]; 
  }

  function selfTransacts(address walletAddress) public view returns(string[] memory ){
    return walletToTransactionHashed[walletAddress]; 
  }

  function setAdmin(address _admin2) public {
    require(msg.sender == admin1 , 'only admin');
    admin2 = _admin2;
  }

}