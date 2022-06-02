import { initialized, saveReferralList, saveWallet, setChainData } from '../../utils/constants'

const initialState = {
  referralList: [],
  walletAddress: "",
  chainData: {
    chainName: "Calib",
    chainId: "calibchain",
    rpcEndpoint: "localhost:26657",
    faucet: "http://localhost:4500",
    restEndpoint: "http://localhost:1317",
    microDenom: "calib",
    coinDecimals: 6,
    gasPrice: "0.25",
    addressPrefix: "calib",
  },
  initialized: false,
};

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case saveWallet: {
      return { ...state, walletAddress: action.walletAddress }
    }
    case saveReferralList: {
      return { ...state, referralList: action.referralList }
    }
    case setChainData: {
      return { ...state, chainData: action.payload }
    }
    case initialized: {
      return { ...state, initialized: action.payload }
    }
    default:
      return state
  }
};