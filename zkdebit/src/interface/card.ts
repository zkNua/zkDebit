export interface ICardInfo {
    owner: string; // Address of the card owner
    card_number: string; // Hashed or encrypted card number
    public_output1: string; // First public output (e.g., from zk-SNARK proof)
    public_output2: string; // Second public output
    public_output3: string; // Third public output}
    created: Date
}