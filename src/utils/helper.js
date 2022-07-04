import { fromMicroDenom } from "./coins.ts";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { constants } from "./constants";
const chainId = "calibchain";

let accounts, offlineSigner, client, cwClient;

export const suggestChain = async (config) => {
  const keplr = window.keplr;

  const coinMinimalDenom = config["microDenom"];
  const coinDecimals = Number.parseInt(config["coinDecimals"]);
  const coinGeckoId = config["coinGeckoId"];
  const chainId = config["chainId"];
  const chainName = config["chainName"];
  const rpcEndpoint = config["rpcEndpoint"];
  const restEndpoint = config["restEndpoint"];
  const addrPrefix = config["addressPrefix"];
  const gasPrice = Number.parseFloat(config["gasPrice"]);
  const coin = fromMicroDenom(coinMinimalDenom);
  const coinDenom = coin.toUpperCase();
  const CosmosCoinType = 118;

  await keplr.experimentalSuggestChain({
    chainId,
    chainName,
    rpc: rpcEndpoint,
    rest: restEndpoint,
    bip44: {
      coinType: CosmosCoinType,
    },
    bech32Config: {
      bech32PrefixAccAddr: addrPrefix,
      bech32PrefixAccPub: `${addrPrefix}pub`,
      bech32PrefixValAddr: `${addrPrefix}valoper`,
      bech32PrefixValPub: `${addrPrefix}valoperpub`,
      bech32PrefixConsAddr: `${addrPrefix}valcons`,
      bech32PrefixConsPub: `${addrPrefix}valconspub`,
    },
    currencies: [
      {
        coinDenom,
        coinMinimalDenom,
        coinDecimals,
      },
    ],
    feeCurrencies: [
      {
        coinDenom,
        coinMinimalDenom,
        coinDecimals,
        coinGeckoId,
      },
    ],
    stakeCurrency: {
      coinDenom,
      coinMinimalDenom,
      coinDecimals,
      coinGeckoId,
    },
    coinType: 118,
    gasPriceStep: {
      low: gasPrice / 2,
      average: gasPrice,
      high: gasPrice * 2,
    },
  });
};

export const connectWallet = async () => {
  if (!window.getOfflineSigner || !window.keplr) {
    alert("Please install keplr extension");
  }

  try {
    await window.keplr.enable(chainId);
    offlineSigner = window.keplr.getOfflineSigner(chainId);
    accounts = await offlineSigner.getAccounts();
    return {
      address: accounts[0].address,
    };
  } catch (error) {
    console.log("Error connecting wallet!", error);
  }
};


export const initialize = async () => {
  await window.keplr.enable(chainId);
  offlineSigner = window.getOfflineSigner(chainId);
  const options = {
    gasprice: new GasPrice(10, "calib"),
  };
  const tmClient = await Tendermint34Client.connect("http://localhost:26657");

  cwClient = new SigningCosmWasmClient(tmClient, offlineSigner, options);

  client = await CosmWasmClient.connect(
    "http://localhost:26657",
  )
};


export const getReferralData = async () => {
  try {
    await initialize();
    const res = await client.queryContractSmart(constants.MLM_CONTRACT_ADDRESS, { "get_referral_info": { "address": accounts[0].address } })
    return res;
  } catch (err) {
    console.log("ERR", err)
  }
}
