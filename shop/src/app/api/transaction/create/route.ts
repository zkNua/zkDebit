import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest, res : NextResponse) {
  try {
    const body = await req.json();
    const { pi3, _amount , transaction_hashed } = body;
    // Host send to bank 
    await axios.post("http://localhost:4000/create-transaction",{
      pi3: pi3,
      amount: _amount,
      transaction_hashed: transaction_hashed,     
    })

    return NextResponse.json(
        {
            success: true,
            message: "Data received successfully!" 
        },
        {
            status: 200
        }
    )
  } catch (error: any) {
    // Handle errors gracefully
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}