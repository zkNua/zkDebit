export interface iGoodPayload { 
    name : string
    details : string 
    amount : number
    ppp : number  // price per piece
}

export enum TransactionStatus{ 
    Unknown,    // 0 
    Pending,    // 1 
    Rejected,   // 2 
    Approved    // 3   
}

export interface ITransactionStatusResponse {
    success: boolean;
    order_status: number;
    description: string;
    error: string;
}