import React from 'react'

type Props = {}

import { CardRegister } from '../../services/generatingProof'
import CardRegisterContainer from '@/components/cardRegisteration/mainContainer'

export default function page({}: Props) {
  return (
    <main>
        <CardRegisterContainer/>
    </main>
  )
}