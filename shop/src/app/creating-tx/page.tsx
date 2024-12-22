'use client'

import React from 'react'
import CreatingTransaction from '../../services/transactions/creatingTransaction'

type Props = {}

export default function page({}: Props) {
    const OnCreatingTx = async ()=>{
        const payload = {
            "pi3" : "01234567890",
            "goods" : [
                {
                    "name" : "Shirt",
                    "details" : "White plain shirt", 
                    "amount" : 1,
                    "ppp" : 20
                },
                {
                    "name" : "Book",
                    "details" : "Frogs book", 
                    "amount" : 1,
                    "ppp" : 80
                }
            ]
        }
        try { 
            const response = await CreatingTransaction(
                payload.pi3,
                payload.goods
            );
            console.log(response); 
        }catch(err){
            console.log(err);
        }
    }
    return (
        <section>
            <button
                onClick={OnCreatingTx}
            >
                Creating tx 
            </button>
        </section>
    )
}