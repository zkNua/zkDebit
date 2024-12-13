import { ethers } from "ethers";
import { CardVerifierRouterAbi } from "assets/contractAbi";

const provider = new ethers.WebSocketProvider(`${process.env.WEBSOCKET_SEPOLIA}`); 
const contract = new ethers.Contract(
    `${process.env.CARD_VERIFIER_ROUTER_ADDRESS}`,
    CardVerifierRouterAbi,
    provider
);

let verifyLogListener = (prover : string ,txHashed : string ,proof : boolean, event : any)=>{
    console.log('🔔 Event Detected!');
    console.log('Verifier:', prover);
    console.log('Transaction Hashed:', txHashed);
    console.log('Proof Valid:', proof);
    console.log('Event Details:', event); 
}

export async function ListenContractEvent (){
    contract.on('VerifyLog',verifyLogListener)
    provider.on('error', (error) => {
        console.error('❌ WebSocket Provider Error:', error);
    });

    provider.on('close', () => {
        console.log('❌ WebSocket Connection Closed');
    });
}

export async function StopListenContractEvent(){
    if (contract) {
        console.log("🔌 Removing event listener");
        contract.off("VerifyLog", verifyLogListener);     
    }
}