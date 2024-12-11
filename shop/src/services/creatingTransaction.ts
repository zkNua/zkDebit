'use server'
import { iGoodPayload } from "../interface/transaction";
import crypto from 'crypto';

// Creating transaction hashed include with Pi3 & amount to both bank host & zkdebit host
export default async function CreatingTransaction(
    pi3: string,
    goods: iGoodPayload
){

    const stringGoods = JSON.stringify(goods);
    const transactionHashed = crypto
    .createHash("sha256")
    .update(`${stringGoods} ${pi3}`)
    .digest("hex")

    // Host send to bank 
    await fetch("http://localhost:4000/create-transaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            transaction_hashed: transactionHashed ,
            amount: goods.amount,
            check_pi3: pi3
        })
    })

    await fetch("https://zkdebit-host/create-transaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            transaction_hashed: transactionHashed,
            amount: goods.amount,
            check_pi3: goods.ppp
        })
    })

    console.log("Transaction created successfully!")
    return true 
}