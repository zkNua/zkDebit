'use server';

import fs from 'fs';
import path from 'path';
import { ICardInfo } from "@/interface/card";

const dbPath = path.resolve(process.cwd(), 'db', 'cards.json');

// Ensure the database file exists
const ensureDBFileExists = () => {
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        fs.writeFileSync(dbPath, JSON.stringify([]), 'utf-8');
    }
};

// Load cards from JSON file
const loadCards = (): ICardInfo[] => {
    ensureDBFileExists();
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

// Save cards to JSON file
const saveCards = (cards: ICardInfo[]) => {
    ensureDBFileExists();
    fs.writeFileSync(dbPath, JSON.stringify(cards, null, 2), 'utf-8');
};

// Add a new card
export const UpdateCards = async (card: ICardInfo) => {
    const cards = loadCards();
    cards.push(card);
    saveCards(cards);
};

// Get all cards
export const LogsCards = async (): Promise<ICardInfo[]> => {
    return loadCards();
};