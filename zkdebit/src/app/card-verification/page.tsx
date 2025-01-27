import React from 'react'

import CardVerificaitonContainer from '@/components/cardVerificationContainer'
import CardsLogContainer from '@/components/cardsLogContainer'

type Props = {}

export default function page({}: Props) {
  return (
    <div>
        Card Verification
        <CardVerificaitonContainer/>
        <CardsLogContainer/>
    </div>
  )
}