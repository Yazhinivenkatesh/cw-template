import { saveReferralList, saveWallet, saveReferralData } from '../../utils/constants';

export const saveWalletAddress = (walletAddress) => ({ type: saveWallet, walletAddress });
export const saveReferralDetail = (referralList) => ({ type: saveReferralList, referralList })
export const saveReferralDatas = (referralData) => ({ type: saveReferralData, referralData})
