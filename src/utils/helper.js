import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { coin } from "@cosmjs/proto-signing";

import { fromMicroDenom } from "./coins.ts";
const chainId = "calibchain";
const stdFee = {
  amount: [
    {
      denom: "calib",
      amount: "222500",
    },
  ],
  gas: "80000000",
};

let accounts, offlineSigner;

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

    console.log(accounts);
    if (accounts !== undefined) {
      localStorage.setItem("account", JSON.stringify(accounts[0]));
    }

    return {
      address: accounts[0].address,
    };
  } catch (error) {
    console.log("Error connecting wallet!", error);
  }
};
