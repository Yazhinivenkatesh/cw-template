import { WalletOutlined } from "@ant-design/icons";
import { connectWallet, getReferralData } from "../../utils/helper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveWalletAddress,
  saveReferralDatas
} from "../../redux/Wallet/actions";
import "./header.css";

const Header = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector(
    (state) => state.rootReducer.wallet.walletAddress
  );
  useEffect(() => {
    (async () => {
      await updateWallet();
    })();
  });

  const updateWallet = async () => {
    const response = await connectWallet();
    if (response != null) {
      dispatch(saveWalletAddress(response.address));
      const refData = await getReferralData();
      dispatch(saveReferralDatas(refData));
    }
  };

  return (
    <div className="bg header flex-and-between">
      <div>
        <h2 className="primary brand-name">DASHBOARD</h2>
      </div>
      <button
        title="Connect wallet"
        className="border-radius flex-and-between border-0 wallet-btn"
        onClick={updateWallet}
      >
        <WalletOutlined className="ms-2 mb-1 wallet-icon" />
        <h4 className="wallet-address ms-2 mb-1">
          {walletAddress !== null ? walletAddress : "Connect Wallet"}
        </h4>
      </button>
    </div>
  );
};

export default Header;
