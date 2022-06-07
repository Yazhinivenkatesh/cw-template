import { React, useState, useEffect } from "react";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { isEmpty, map } from "lodash";
import { Table } from "antd";

import "./landing.css";
import { TextField } from "@mui/material";
import { suggestChain } from "../../utils/helper";

import axios from "axios";
import {
  Box,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Modal,
  Select,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
import WALLET from "../../assets/wallet.svg";
import { constants } from "../../utils/constants";

const Landing = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 50,
    p: 4,
  };

  let cwClient, client, offlineSigner, amount, referralData;

  const walletAddress = useSelector(
    (state) => state.rootReducer.wallet.walletAddress
  );
  const referralDetail = useSelector(
    (state) => state.rootReducer.wallet.referralData
  )

  if (!isEmpty(referralDetail)) {
    referralData = referralDetail;
    // console.log("REFF.......", referralData['user_referrals']?.[0]?.referrals);
  } else {
    referralData = [];
  }

  const defaultBalance = {
    coinBalance: "0 calib",
    tokenBalance: " 0",
  };

  const [referrer, setReferrer] = useState("");
  const [planName, setPlanName] = useState("");
  const [connected, setConnected] = useState(false);
  const [accountBalance, setAccountBalance] = useState(defaultBalance);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    initialize();
  }, [walletAddress]);

  const defaultChainData = {
    chainName: "Calib",
    chainId: "calibchain",
    rpcEndpoint: "localhost:26657",
    faucet: "http://localhost:4500",
    restEndpoint: "http://localhost:1317",
    microDenom: "calib",
    coinDecimals: 6,
    gasPrice: "0.25",
    addressPrefix: "calib",
  };

  const [chainData, setChainData] = useState(defaultChainData);
  const stdFee = {
    amount: [
      {
        denom: "calib",
        amount: "222500",
      },
    ],
    gas: "80000000",
  };

  const addNetwork = async () => {
    const data = await CosmWasmClient.connect(chainData.rpcEndpoint);
    try {
      await suggestChain(chainData);
      setConnected(true);
    } catch (error) {
      setConnected(false);
    }
  };

  const { TOKEN_CONTRACT_ADDRESS, MLM_CONTRACT_ADDRESS, ADMIN } = constants;

  const initialize = async () => {
    await window.keplr.enable(chainData.chainId);
    offlineSigner = window.getOfflineSigner(chainData.chainId);
    const options = {
      gasprice: new GasPrice(10, "calib"),
    };
    const tmClient = await Tendermint34Client.connect("http://localhost:26657");

    cwClient = new SigningCosmWasmClient(tmClient, offlineSigner, options);

    client = await CosmWasmClient.connect("http://localhost:26657");
  };

  const getCoinBalance = async () => {
    const response = await axios.get(
      `http://localhost:1317/cosmos/bank/v1beta1/balances/${walletAddress}?pagination.limit=1000`
    );
    const balance = {
      coinBalance: response.data.balances[0].amount,
      tokenBalance: 0,
    };
    setAccountBalance(balance);
    await getTokenBalance();
  };

  const getTokenBalance = async () => {
    await initialize();
    const result = await client.queryContractSmart(TOKEN_CONTRACT_ADDRESS, {
      balance: { address: walletAddress },
    });
    setAccountBalance((prev) => ({ ...prev, tokenBalance: result.balance }));
  };

  const allowance = async () => {
    try {
      await initialize();
      const response = await client.queryContractSmart(TOKEN_CONTRACT_ADDRESS, {
        allowance: { owner: walletAddress, spender: MLM_CONTRACT_ADDRESS },
      });
      if (response.allowance === "0") {
        const result = await cwClient.execute(
          walletAddress,
          TOKEN_CONTRACT_ADDRESS,
          {
            increase_allowance: {
              spender: MLM_CONTRACT_ADDRESS,
              amount: "10000",
            },
          },
          stdFee
        );
        toast.success("APPROVED SUCCESSFULLY");
      }
    } catch (err) {
      const error = err?.message;
      if (error.includes("rejected")) {
        toast.error("USER DENIED TRANSACTION");
      } else if(error.includes("allowance")) {
        toast.error("NO ALLOWANCE FOR PROVIDED!");
      }else{
        toast.error("ERROR WHILE PROVIDING ALLOWANCE");
      }
    }
  };

  const addReferrer = async () => {
    try {
      await initialize();
      const response = await cwClient.execute(
        walletAddress,
        MLM_CONTRACT_ADDRESS,
        { add_referral: { referrer: referrer } },
        stdFee
      );
      toast.success("REFERRAL ADDED SUCCESSFULLY");
    } catch (err) {
      const error = err?.message;
      switch (true) {
        case error.includes("OWN"):
          toast.error("REFERRAL CANNOT BE HIS OWN REFERRER");
          break;
        case error.includes("ONE"):
          toast.error("REFERRAL CANNOT BE ONE OF REFERRER UPLINES");
          break;
        case error.includes("addr_validate"):
          toast.error("INVALID ADDRESS");
          break;
        case error.includes("rejected"):
          toast.error("USER DENIED TRANSACTION");
          break;
        default:
          toast.error("SOMETHING WENT WRONG, RETRY AFTER SOME TIME");
      }
    }
  };

  const payReferrer = async () => {
    try {
      await initialize();
      const response = await cwClient.execute(
        walletAddress,
        MLM_CONTRACT_ADDRESS,
        { pay_referral: { plan_name: planName } },
        stdFee
      );
      toast.success("PAID SUCCESSFULLY");
    } catch (err) {
      const error = err?.message;
      switch (true) {
        case error.includes("exist"):
          toast.error("PLAN DOES NOT EXIST");
          break;
        case error.includes("ALREADY"):
          toast.error("USER ALREADY PAID");
          break;
        case error.includes("ENOUGH"):
          toast.error("USER BALANCE IS NOT ENOUGH");
          break;
        case error.includes("rejected"):
          toast.error("USER DENIED TRANSACTION");
          break;
        case error.includes("allowance"):
          allowance();
          break;
        default:
          toast.error("SOMETHING WENT WRONG, RETRY AFTER SOME TIME");
      }
    }
  };

  const buyTokens = async () => {
    try {
      await initialize();
      amount = parseFloat(amount);
      if (isNaN(amount)) {
        toast.error("INVALID AMOUNT");
        return false;
      }

      amount *= 1000000;
      amount = Math.floor(amount);

      const amountFinal = {
        denom: "calib",
        amount: amount.toString(),
      };

      const result = await cwClient.sendTokens(
        walletAddress,
        ADMIN,
        [amountFinal],
        stdFee,
        ""
      );

      if (result.code !== undefined && result.code === 0) {
        toast.success("SUCCESSFULLY SENT CALIB COINS");

        const response = await cwClient.execute(
          walletAddress,
          MLM_CONTRACT_ADDRESS,
          { buy_tokens: { amount_to_buy: amount.toString() } },
          stdFee
        );
        toast.success("TOKENS BOUGHT SUCCESSFULLY");
      } else {
        toast.error(
          "TRANSACTION FAILED: USER DOES NOT HAVE ENOUGH COINS TO SEND !"
        );
      }
    } catch (err) {
      const error = err?.message;
      if (error.includes("rejected")) {
        toast.error("USER DENIED TRANSACTION");
      } else {
        toast.error("SOMETHING WENT WRONG, RETRY AFTER SOME TIME");
      }
    }
  };

  const handleOnchange = (key, event) => {
    chainData[key] = event.target.value;
    setChainData(chainData);
  };

  const handlePlanchange = (event) => {
    setPlanName(event.target.value);
  };

  const handeleReferrerChange = (event) => {
    setReferrer(event.target.value);
  };

  const handeleAmountChange = (event) => {
    amount = event.target.value;
  };

  const inputs = [
    {
      key: "chainName",
      name: "Chain name",
    },
    {
      key: "chainId",
      name: "Chain Id",
    },
    {
      key: "rpcEndpoint",
      name: "RPC Endpoint",
    },
    {
      key: "restEndpoint",
      name: "REST Endpoint",
    },
    {
      key: "faucet",
      name: "Faucet Endpoint",
    },
    {
      key: "microDenom",
      name: "Denom",
    },
    {
      key: "coinDecimals",
      name: "Decimals",
    },
    {
      key: "gasPrice",
      name: "Gas price",
    },
    {
      key: "addressPrefix",
      name: "Address Prefix",
    },
  ];

  const columns = [
    {
      title: "Wallet Adress",
      dataIndex: "referral",
      key: "referral",
    },
    {
      title: "Amount",
      dataIndex: "amount_paid",
      key: "amount_paid",
    },
  ];
  return (
    <div className="landing">
      <ToastContainer />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="mb-3">
            <h2 className="text-black">Buy Tokens</h2>
            <div>
              <TextField
                required
                id="outlined-text-input"
                label={"Amount To Buy"}
                type="text"
                className="mt-3 me-3 w-100"
                onChange={(e) => handeleAmountChange(e)}
              />
            </div>
            <Button
              variant="contained"
              onClick={buyTokens}
              className="mt-4 w-100 border-radius connect-btn btn"
            >
              <h6 className="p-2">Buy Now</h6>
            </Button>
          </div>
          <Button onClick={handleClose}>close</Button>
        </Box>
      </Modal>

      <div className="d-flex justify-content-between mb-3">
        <div className="col m-3">
          <div className="border border-radius shadow col">
            <div className="row mb-2 mt-2 d-flex align-items-center">
              <div className="chain-logo col">
                <img
                  height="100%"
                  width="100%"
                  className="object-fit-contain"
                  src={WALLET}
                  alt="chain-logo"
                />
              </div>
              <div className="row col">
                <div className="d-flex align-items-center mb-2">
                  <h5 className="text-black">
                    <b>Address: </b>
                  </h5>
                  <h5 className="primary ms-3">
                    {walletAddress || "Calib234ijbwdsjfhbsu232i354ybjkhwdbf"}
                  </h5>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <h5 className="text-black">
                    <b>Coins:</b>
                  </h5>
                  <h5 className="primary ms-3">{accountBalance.coinBalance}</h5>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <h5 className="text-black">
                    <b>Tokens:</b>
                  </h5>
                  <h5 className="primary ms-3">
                    {accountBalance.tokenBalance} token
                  </h5>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <Button
                variant="contained"
                className="w-50 mb-2 btn mr-2"
                onClick={getCoinBalance}
              >
                check balance
              </Button>
              <Button
                variant="contained"
                className="w-50 mb-2 btn"
                onClick={handleOpen}
              >
                Get more tokens
              </Button>
            </div>
          </div>

          <div className="border-radius border shadow col mt-3">
            <div className="mb-3 mt-2">
              <h5 className="text-black bold">
                <b>Add referral</b>
              </h5>
              <div className="d-flex justify-content-between mt-3">
                <TextField
                  required
                  id="outlined-text-input"
                  label={"Referrer address"}
                  type="text"
                  className="me-3 w-100"
                  onChange={(e) => handeleReferrerChange(e)}
                />
                <Button
                  variant="contained"
                  onClick={addReferrer}
                  className="border-radius connect-btn btn"
                >
                  <h6 className="p-2">Add referral</h6>
                </Button>
              </div>
            </div>

            <div className="mb-3">
              <h5 className="text-black bold">
                <b>Pay referral</b>
              </h5>
              <div className="d-flex justify-content-between mt-3">
                <FormControl fullWidth className="me-3 primary">
                  <InputLabel id="select-label">Plan</InputLabel>
                  <Select
                    value={planName}
                    label="Plan"
                    onChange={handlePlanchange}
                  >
                    <MenuItem value="basic">Basic - 500 Calib Tokens</MenuItem>
                    <MenuItem value="premium">Premium - 750 Calib Tokens</MenuItem>
                    <MenuItem value="standard">Standard - 1000 Calib Tokens</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={payReferrer}
                  className="border-radius connect-btn btn"
                >
                  <h6 className="p-2">Pay now</h6>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col border border-radius shadow m-3 d-flex align-content-center mr-2">
          <div className="mt-4">
            <h4 className="text-black mt-2 mb-3">
              <b> Network configuration</b>
            </h4>
            <div className="flex-and-between">
              {map(inputs, (input, i) => (
                <TextField
                  key={i}
                  id="outlined-text-input"
                  label={input.name}
                  type="text"
                  className="mt-3"
                  onChange={(e) => handleOnchange(input.key, e)}
                  defaultValue={defaultChainData[input.key]}
                />
              ))}
              <Button
                variant="contained"
                onClick={addNetwork}
                className="mt-3 w-100 border-radius connect-btn btn mb-2"
              >
                <h6 className="p-2">{connected ? "Connected" : "Connect"} </h6>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex">
        <Grid container>
          {referralData['user_referrals'] &&
            map(referralData['user_referrals'], (data, i) => {
              return <Grid item lg={6} key={i}>
                <div>
                  <div className="p-5">
                    <h2 className="text-black">Level {i+1}</h2>
                    <div className="mt-4 col border border-radius shadow">
                      {referralData['user_referrals'] &&
                        <Table dataSource={referralData['user_referrals'][i].referrals} columns={columns} />
                      }
                    </div>
                  </div>
                </div>
              </Grid>
            })
          }
        </Grid>
      </div>
    </div>
  );
};
export default Landing;
