import {
    CosmWasmClient,
    SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { isEmpty } from "lodash";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

export const saveWallet = "saveWallet";
export const saveReferralList = "saveReferralList";
export const constants = {
    ADMIN: "calib1ays90mvzfr09fqgjet23mmpxvuvnnafpflj74k",
    TOKEN_CONTRACT_ADDRESS: "calib14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9scdfxd2",
    MLM_CONTRACT_ADDRESS: "calib1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrq5cvy0v"
};
export const setChainData = 'chainData'
export const initialized = 'initialize'


// export const initialize = async (chainData) => {
//     let offlineSigner, client, cwClient;
//     await window.keplr.enable(chainData.chainId);
//     offlineSigner = window.getOfflineSigner(chainData.chainId);
//     const options = {
//         gasprice: new GasPrice(10, "calib"),
//     };
//     const tmClient = await Tendermint34Client.connect("http://localhost:26657");

//     cwClient = new SigningCosmWasmClient(tmClient, offlineSigner, options);

//     client = await CosmWasmClient.connect(
//         "http://localhost:26657",
//     )

//     return { client: client, isInitialized: true }
// };

// export const getReferralList = async (chainData, walletAddress) => {
// debugger
//    let refList = []
//    const obj = await initialize(chainData);
//     try {
//         const response = await obj.client.queryContractSmart(constants.MLM_CONTRACT_ADDRESS, { "get_level_detail": { "address": walletAddress, "level_count": "1" } })
//         if (response && !isEmpty(response)) {
//             refList(list => response[0]['referrals'])
//         }
//         return refList
//     } catch (e) {
//         console.log("ERR", e)
//     }
// }