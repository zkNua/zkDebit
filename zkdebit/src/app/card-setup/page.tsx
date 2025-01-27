import React from 'react'

type Props = {}

import { CardRegister } from '../../services/generatingProof'
import CardRegisterContainer from '@/components/cardRegisterContainer'
import CardsLogContainer from '@/components/cardsLogContainer'

export default function page({}: Props) {
  return (
    <main className=''>
        <CardRegisterContainer/>
        <CardsLogContainer/>
    </main>
  )
}