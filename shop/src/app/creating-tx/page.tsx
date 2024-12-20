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
                    "name" : "Item1",
                    "details" : "Item 1 details", 
                    "amount" : 5,
                    "ppp" : 100
                },
                {
                    "name" : "Item2",
                    "details" : "Item 2 details", 
                    "amount" : 10,
                    "ppp" : 200
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