import { Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import "./header.css";
import { connectWallet } from "../../utils/helper";
import { useEffect, useState } from "react";

const Header = () => {
  const [account, setAccount] = useState(null);
  
  window.onload = async () => {
    const response = await connectWallet();
    if (response != null) {
      setAccount((account) => response);
    }
  };

  return (
    <div className="bg header flex-and-between">
      <div>
        <h2>Calib console</h2>
      </div>
      <button
        title="Connect wallet"
        className="border-radius flex-and-between border-0 wallet-btn"
        onClick={connectWallet}
      >
        <WalletOutlined className="ms-2 mb-1 wallet-icon" />
        <h4 className="wallet-address ms-2 mb-1">{account !== null ? account.address : "Connect Wallet"}</h4>
      </button>
    </div>
  );
};

export default Header;
