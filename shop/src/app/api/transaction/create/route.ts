
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res : NextResponse) {
  try {
    const body = await req.json();
    const { pi3, _amount , transaction_hashed } = body;
    console.log(pi3, _amount , transaction_hashed)
    // Host send to bank 
    await fetch("http://localhost:4000/create-transaction", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pi3: pi3,
        amount: _amount,
        transaction_hashed: transaction_hashed
      })
  })

  // await fetch("https://zkdebit-host/create-transaction", {
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //         transaction_hashed: transactionHashed,
  //         amount: goods.amount,
  //         check_pi3: goods.ppp
  //     })
  // })

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