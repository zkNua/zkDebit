import * as snarkjs from "snarkjs";
import crypto from "crypto";

// Function to hash the string using SHA-256 and convert it to a BigInt-compatible format
function hashStringToBigInt(input : string) {
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    return BigInt('0x' + hash).toString();
}

export async function CardRegister(
    card_number: string ,
    cvc: string,
    salt: string
){
    const hashed_salt = hashStringToBigInt(salt);
    const hashed_cvc = hashStringToBigInt(cvc);
    console.log(card_number,cvc,salt,hashed_salt,hashed_cvc)
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {
            "cardNumber": card_number,
            "salt": hashed_salt,
            "cvc": hashed_cvc
        },
        "/assets/cardSetup/cardSetup.wasm",
        "/assets/cardSetup/cardSetup_0001.zkey"
    );
    console.log("public output : ",publicSignals);
    return {
        card_number: card_number,
        public_output: JSON.stringify(publicSignals)
    };
}

export async function CardVerification(
    public_output: string[],
    card_number: string, 
    transaction: string,
    nonce: string
){
    const hashed_transaction = hashStringToBigInt(transaction);
    const hashed_nonce = hashStringToBigInt(nonce)

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        {
            "cardNumber": card_number,
            "pi1": public_output[0],
            "pi2": public_output[1],
            "pi3": public_output[2],
            "transaction": hashed_transaction,
            "nonce": hashed_nonce,
        },
        "/assets/cardVerification/cardVerification.wasm",
        "/assets/cardVerification/cardVerification_0001.zkey"
    );

    return {
        card_number: card_number,
        proof: JSON.stringify(proof),
        public_output: JSON.stringify(publicSignals)
    };
}

