import {saveReferralData, saveReferralList, saveWallet} from '../../utils/constants'

const initialState = {
  referralList: [],
  referralData: {},
  walletAddress: "",
};

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case saveWallet: {
      return { ...state, walletAddress: action.walletAddress }
    }
    case saveReferralList: {
      return { ...state, referralList: action.referralList }
    }
    case saveReferralData: {
      return { ...state, referralData: action.referralData}
    }
    default:
      return state
  }
};