import { NextRequest, NextResponse } from 'next/server';

import { ethers } from 'ethers';
import { CardVerifierRouterAbi } from 'assets/contractAbi';
import { TransactionStatus } from '../../../../../interface/transaction';

import dotenv from 'dotenv';

dotenv.config();

const PROVIDER_URL = process.env.WEBSOCKET_SEPOLIA || '';
const CONTRACT_ADDRESS = process.env.CARD_VERIFIER_ROUTER_ADDRESS || '';

export async function GET(
  request: NextRequest,
  { params }: { params: { txid: string } }
) {
  try {
    const txid = (await params).txid;

    if (!txid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing txid in URL path' 
      }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CardVerifierRouterAbi, provider);

    const response = await contract.checkTransactionValid(txid);
    const status = ethers.toNumber(response);
    const estatus = TransactionStatus[status];
    console.log(estatus)
    switch (status) { 
      case 0 : 
        return NextResponse.json({ 
          success: false, 
          status : estatus, 
          description : "Unknown transaction",
          error: 'transaction not found' 
        }, { status: 200 });
      case 1 : 
        return NextResponse.json({ 
          success: false, 
          description : "Pending transaction",
          error: 'transaction not found' 
        }, { status: 200 });
      case 2: 
        return NextResponse.json({ 
          success: false, 
          description : "Transaction rejected",
          error: 'transaction has been reject' 
        }, { status: 200 });
        case 3: 
        return NextResponse.json({ 
          success: true, 
          description : "Approved transaction",
          error: 'transaction approved' 
        }, { status: 200 });
      }
  } catch (error) {

    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}