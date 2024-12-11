import { NextRequest, NextResponse } from "next/server";

import CreatingTransaction from "../../../../services/creatingTransaction";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pi3, goods } = body;

    CreatingTransaction(pi3, goods);
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