import { HardhatUserConfig } from "hardhat/config";

import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: true,
  },
  networks: {
    hardhat: {
      allowBlocksWithSameTimestamp: true,
    },
    holesky: {
      url: process.env.RPC_HOLESKY! || "",
      accounts: [process.env.VERIFIER_PRIVATE_KEY_HOLESKY!]
    },
    sepolia: {
      url: process.env.RPC_SEPOLIA! || "",
      accounts: [process.env.VERIFIER_PRIVATE_KEY_SEPOLIA!]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY! || "",
    customChains: [
      {
        network: "holesky",
        chainId: 17000,
        urls: {
          apiURL: "https://api-holesky.etherscan.io/api",
          browserURL: "https://holesky.etherscan.io"
        }
      }
    ]
  }
};

export default config;
