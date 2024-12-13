import { ethers } from "ethers";
import { CardVerifierRouterAbi } from "assets/contractAbi";

const PROVIDER_URL = process.env.WEBSOCKET_SEPOLIA || "";
const CONTRACT_ADDRESS = process.env.CARD_VERIFIER_ROUTER_ADDRESS || "";
const POLLING_INTERVAL = 60000;

class HybridEventListener { 
    private provider : ethers.WebSocketProvider | null = null;
    private contract : ethers.Contract | null = null;
    private event_name : string = "";
    private parameters : any[] = [];
    private pollingInterval: NodeJS.Timeout | null = null;


    constructor(
        _event_name: string,
        _parameters : any[] = []
    ){
        this.event_name = _event_name;
        this.parameters = _parameters;
        this.initializeWebSocketListener();
    }

    private initializeWebSocketListener( ){ 
        console.log(`🔌 Setting up WebSocket listener for event: ${this.event_name}`);
        this.provider = new ethers.WebSocketProvider(PROVIDER_URL);
        this.contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CardVerifierRouterAbi,
            this.provider
        )
        try {
            this.contract.on(this.event_name,(...args) => this.listenerEvent(args))
            this.provider.on("error", (error) => {
                console.error("❌ WebSocket Error please refresh:", error);
                this.PollingFallback();
            });
    
            this.provider.on("close", () => {
                console.log("❌ WebSocket Connection Closed");
                this.reconnectWebSocket();
            });
        }catch(err){
            this.PollingFallback();
        }
  
    }

    private async listenerEvent(args: any[]) {
        try {
          console.log("🔔 Event Detected:", this.event_name);
          console.log("Parameters:", this.parameters);
          console.log("Arguments:", args);
    
          // Implement additional logic here (e.g., save to database, notify users)
          await this.processEvent(args);
        } catch (error) {
          console.error("❌ Error handling event:", error);
        }
    }

    private async processEvent (args : any){
        console.log("Notification services send or called here to tell in frontend")
    }

    private PollingFallback(){
        if (this.pollingInterval) return; // Avoid multiple pollers

        console.log("⚠️ Switching to polling fallback...");
        this.pollingInterval = setInterval(async () => {
        try {
            const jsonProvider = new ethers.JsonRpcProvider(PROVIDER_URL);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CardVerifierRouterAbi, jsonProvider);

            // Query the latest events
            const events = await contract.queryFilter(this.event_name, -100); // Last 100 blocks
            events.forEach((event : any) => this.listenerEvent(event.args));
        } catch (error) {
            console.error("❌ Polling Error:", error);
        }
        }, POLLING_INTERVAL);
    }

    private reconnectWebSocket() {
        console.error("❌ Max reconnection attempts reached. Switching to polling.");
        this.initializeWebSocketListener();
    }
}

// const provider = new ethers.WebSocketProvider(`${process.env.WEBSOCKET_SEPOLIA}`); 
// const contract = new ethers.Contract(
//     `${process.env.CARD_VERIFIER_ROUTER_ADDRESS}`,
//     CardVerifierRouterAbi,
//     provider
// );

// let verifyLogListener = (prover : string ,txHashed : string ,proof : boolean, event : any)=>{
//     console.log('🔔 Event Detected!');
//     console.log('Verifier:', prover);
//     console.log('Transaction Hashed:', txHashed);
//     console.log('Proof Valid:', proof);
//     console.log('Event Details:', event); 
// }

// export async function ListenContractEvent (){
//     contract.on('VerifyLog',verifyLogListener)
//     provider.on('error', (error) => {
//         console.error('❌ WebSocket Provider Error:', error);
//     });

//     provider.on('close', () => {
//         console.log('❌ WebSocket Connection Closed');
//     });
// }

// export async function StopListenContractEvent(){
//     if (contract) {
//         console.log("🔌 Removing event listener");
//         contract.off("VerifyLog", verifyLogListener);     
//     }
// }