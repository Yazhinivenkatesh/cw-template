import {saveReferralList, saveWallet} from '../../utils/constants'

const initialState = {
  referralList: [],
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
    default:
      return state
  }
};