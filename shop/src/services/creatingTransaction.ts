'use server'
import { error } from "node:console";
import { iGoodPayload } from "../interface/transaction";
import crypto from 'crypto';

// Creating transaction hashed include with Pi3 & amount to both bank host & zkdebit host
export default async function CreatingTransaction(
    pi3: string,
    goods: iGoodPayload[]
){
    try{
        if (!pi3 || typeof pi3 !== "string" ){
            throw new Error ("Invalid proof of your card setup phase");
        }
        if (goods.length === 0 ) { 
            throw new Error ("Goods is missing ")
        }
        const totalPrice = goods.reduce((sum, item) => sum + item.ppp * item.amount, 0);         
        const stringGoods = JSON.stringify(goods);
        const transactionHashed = crypto
        .createHash("sha256")
        .update(`${stringGoods} ${pi3}`)
        .digest("hex")

        const response = await fetch(`https://localhost:3000/api/transaction/create`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                transaction_hashed: transactionHashed ,
                amount: totalPrice,
                pi3: pi3
            })
        })
        return response

    }catch (err){
        console.log(err)
    }
    console.log("Transaction created successfully!")
}