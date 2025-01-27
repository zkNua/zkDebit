import * as snarkjs from "snarkjs";

export async function format_generated_proof(_proof: snarkjs.Groth16Proof ,_public: snarkjs.PublicSignals) {
    const call_data = await snarkjs.groth16.exportSolidityCallData(_proof,_public);
    const parsed_call_data = JSON.parse("[" + call_data + "]");
    const [pA, pB, pC, pubSignals] = parsed_call_data;
    return {
        pi_a: pA,
        pi_b: pB,
        pi_c: pC,
        public_signals: pubSignals
    }
}