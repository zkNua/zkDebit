import { NextRequest , NextResponse } from 'next/server';

import { format_generated_proof } from "@/utils/proofFormat";
import VerifyProof from '@/services/verifyProof';

export async function POST(req: NextRequest, res : NextResponse) {
  const { proofs, hashed_transaction } = await req.json();
    if (!hashed_transaction || !proofs) {
      return NextResponse.json(
        { error: "Missing required fields: txHashed or formatted_proof" },
        { status: 400 }
      );
    }
  try {
    const formatted_response = await format_generated_proof(
      JSON.parse(proofs.proof),
      JSON.parse(proofs.public_output)
    );

    const response = await VerifyProof(
      hashed_transaction,
      formatted_response
    );
    return NextResponse.json({
      success: true,
      transactionHash: response.hash,
      details: response,
    });
  } catch (error) {
    console.error("Error in proof generation:", error);
    NextResponse.json({
      success: false,
      transactionHash: hashed_transaction,
      details: null,
    })
  }
}