'use client'

import React from 'react'
import CreatingTransaction from '../../services/transactions/creatingTransaction'

type Props = {}

export default function page({}: Props) {
    const OnCreatingTx = async ()=>{
        const payload = {
            "pi3" : "20758968703736891370751345315858927355504183875744374046651516274714619200554",
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
                payload. goods
            );
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