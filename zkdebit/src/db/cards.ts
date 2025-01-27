'use server'
import { ICardInfo } from "@/interface/card"

const cardsInfo: ICardInfo[] = [

]

export const UpdateCards = async (card: ICardInfo)=>{
    cardsInfo.push(card)
}

export const LogsCards = async ()=>{
    cardsInfo.map((card: ICardInfo)=>{
        console.log(card)
    })
    return cardsInfo
}