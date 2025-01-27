'use client'

import React, { useState } from 'react';
import { LogsCards } from '@/db/cards'; // Import your card data
import { ICardInfo } from '@/interface/card';

type Props = {};

export default function CardsLogContainer({}: Props) {
    const [cards, setCards] = useState<ICardInfo[] | null>(null);

    const fetchCards = async () => {
        const allCards: ICardInfo[] = await LogsCards(); // Assuming LogsCards is a function returning card data
        setCards(allCards);
    };

    return (
        <div>
            <h1>Getting Cards</h1>
            <button
                onClick={async (e) => {
                    e.preventDefault();
                    await fetchCards(); // Fetch cards and update the state
                }}
                style={{
                    padding: '10px 20px',
                    backgroundColor: 'blue',
                    color: 'white',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                See all cards
            </button>

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {cards &&
                    cards.map((card, index) => (
                        <li
                            key={index}
                            style={{
                                border: '1px solid #ccc',
                                padding: '15px',
                                marginBottom: '10px',
                                borderRadius: '5px',
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            <p><strong>Owner:</strong> {card.owner}</p>
                            <p><strong>Card Number:</strong> {card.card_number}</p>
                            <p><strong>Public Output 1:</strong> {card.public_output1}</p>
                            <p><strong>Public Output 2:</strong> {card.public_output2}</p>
                            <p><strong>Public Output 3:</strong> {card.public_output3}</p>
                            <p><strong>Created:</strong> {new Date(card.created).toLocaleString()}</p>
                        </li>
                    ))}
            </ul>
        </div>
    );
}