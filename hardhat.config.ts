import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import 'dotenv/config'


const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    // devnet: {
    //   url: process.env.DEVNET_URL,
    //   chainId: 1,
    // }
  }
};

export default config;
