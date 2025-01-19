import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { txid: string } }
) {
  try {
    const txid = (await params).txid;
    const response = axios.get('http://localhost:4000/shop/check-transaction',{
      params : {
        transaction_hashed : txid
      }
    });
    const payload = (await response).data;
    switch (payload.status) { 
      case 0 :
        return NextResponse.json({ 
          success: false, 
          order_status : payload.status, 
          description : "Unknown transaction",
          error: 'transaction not found' 
        }, { status: 200 });
      case 1 :
        return NextResponse.json({ 
          success: false,
          order_status : payload.status, 
          description : "Pending transaction",
          error: 'transaction not found' 
        }, { status: 200 });
      case 2:
        return NextResponse.json({ 
          success: false, 
          order_status : payload.status, 
          description : "Transaction rejected",
          error: 'transaction has been reject' 
        }, { status: 200 });
        case 3:
        return NextResponse.json({ 
          success: true,
          order_status : payload.status, 
          description : "Approved transaction",
          error: 'transaction approved' 
        }, { status: 200 });
      }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    },{ status: 500 });
  }
}