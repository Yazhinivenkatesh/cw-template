import { saveReferralList, saveWallet } from '../../utils/constants';

export const saveWalletAddress = (walletAddress) => ({ type: saveWallet, walletAddress });
export const saveReferralDetail = (referralList) => ({ type: saveReferralList, referralList })
