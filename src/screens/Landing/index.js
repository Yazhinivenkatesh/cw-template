import { React, useState, useEffect } from "react";
import { Button } from "@mui/material";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { HttpClient, Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { map } from "lodash";
import { Col, Divider, Input, InputNumber, Row } from "antd";

import "./landing.css";
import { TextField } from "@mui/material";
import { FaucetClient } from "@cosmjs/faucet-client";
import { connectWallet, suggestChain } from "../../utils/helper";

import CHAIN_LOGO from "../../assets/chain-logo.png";
import WALLET from "../../assets/wallet.svg";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';


const Landing = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 50,
    p: 4,
  };
  const defaultBalance = {
    coinBalance: "0 calib",
    tokenBalance: " 0 tokens",
  };

  const [referrer, setReferrer] = useState("");
  const [planName, setPlanName] = useState("");
  const [faucetAddress, setFaucetAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [approved, setApproved] = useState(false);
  const [account, setAccount] = useState("");
  // const [accountBalance, setTokenBalance] = useState(defaultBalance);
  let [amount, setAmount] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [txLogs, addTxLogs] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    initialize();
  }, []);

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
    console.log(data);
    try {
      await suggestChain(chainData);
      setConnected(true);
    } catch (error) {
      setConnected(false);
      console.log(error);
    }
  };

  const mlmContractAddress =
    "calib1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrq5cvy0v";

  const tokenContractAddress =
    "calib14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9scdfxd2";

  let cwClient, client, accounts, offlineSigner;

  const initialize = async () => {
    await window.keplr.enable(chainData.chainId);
    offlineSigner = window.getOfflineSigner(chainData.chainId);
    accounts = await offlineSigner.getAccounts();
    setAccount(accounts[0].address);
    const options = {
      gasprice: new GasPrice(10, "calib"),
    };
    const tmClient = await Tendermint34Client.connect("http://localhost:26657");

    cwClient = new SigningCosmWasmClient(tmClient, offlineSigner, options);

    console.log(cwClient);
    client = await CosmWasmClient.connect(
      "http://localhost:26657",
    )
  };

  const addTxLog = (txHash, status) => {
    txLogs.push({ txHash, status });
    addTxLogs(txLogs);
  };

  const getBalance = async () => {
    await initialize();
    const res = await client.queryContractSmart(tokenContractAddress, { "balance": { "address": account } })
    setTokenBalance(res.balance)
  }

  const allowance = async () => {
    try {
      await initialize();
      console.log(client);
      const data = await client.queryContractSmart(mlmContractAddress, { "get_all_referral_datas": {} })
      console.log(data)
      const response = await client.queryContractSmart(tokenContractAddress, { "allowance": { "owner": account, "spender": mlmContractAddress } })
      if (response.allowance === "0") {
        const res = await cwClient.execute(accounts[0].address, tokenContractAddress, { "increase_allowance": { "spender": mlmContractAddress, "amount": "10000" } }, stdFee)
        alert("Appoved Successfully")
      }
      // if (response.allowance > 0) {
      //   setApproved(true)
      // }
    } catch (err) {
      alert(err)
      setApproved(false)
    }
  };

  const addReferrer = async () => {
    try {
      await initialize();
      const res = await cwClient.execute(
        accounts[0].address,
        mlmContractAddress,
        { "add_referral": { referrer: referrer } },
        stdFee
      );
      console.log(res);

      alert("Referral Added Successfully");
    } catch (err) {
      console.log(err);
      const error = err?.message;
      alert(error);
    }
  };

  const payReferrer = async () => {
    try {
      await initialize();
      const res = await cwClient.execute(
        accounts[0].address,
        mlmContractAddress,
        { "pay_referral": { plan_name: planName } },
        stdFee
      );
      console.log(res);
      alert("Paid Successfully");
    } catch (err) {
      console.log(err);
      const error = err?.message;
      if (error.includes("allowance")) {
        allowance();
      } else {
        alert(error);
      }
    }
  };

  const buyTokens = async () => {
    debugger
    await initialize();
    console.log("AMOUNT", amount)
    amount = parseFloat(amount);
    if (isNaN(amount)) {
      alert("Invalid amount");
      return false;
    }

    amount *= 1000000;
    amount = Math.floor(amount);

    const amountFinal = {
      denom: "calib",
      amount: amount.toString(),
    };

    const result = await cwClient.sendTokens(
      accounts[0].address,
      "calib1ays90mvzfr09fqgjet23mmpxvuvnnafpflj74k",
      [amountFinal],
      stdFee,
      ""
    );

    if (result.code !== undefined && result.code !== 0) {
      console.log("FAILED", result);
      alert("Failed to send tx: " + result.log || result.rawLog);
    } else {
      console.log(result);
      alert("Succeed to send tx:" + result.transactionHash);
      const res = await cwClient.execute(
        accounts[0].address,
        mlmContractAddress,
        { "buy_tokens": { amount_to_buy: amount.toString() } },
        stdFee
      );
      console.log(res);
      if (res.code !== undefined && res.code !== 0) {
        alert("Failed to send tx: " + res.log || res.rawLog);
      } else {
        alert("Succeed to send tx:" + res.transactionHash);
      }
    }
  };

  const getCalib = async (amount) => {
    try {
      const faucetClient = new FaucetClient(chainData.faucet);
      await faucetClient.credit(faucetAddress, chainData.microDenom);
    } catch (err) {
      console.log("ERROR in FAUCET", err);
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

  const handleFaucetAddress = (event) => {
    setFaucetAddress(event.target.value);
  };

  const handeleAmountChange = (event) => {
    setAmount(event.target.value);
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

  const planInputs = [
    {
      key: "name",
      name: "Plan name",
    },
    {
      key: "price",
      name: "Plan price",
    },
  ];

  return (
    <Row>
      <Col lg={{ span: 8 }} className="p-5">
        <Col className="border-radius chain-details">
          <div className="mb-3">
            <h2 className="text-black">Add referral</h2>
            <div>
              <TextField
                required
                id="outlined-text-input"
                label={"Referrer address"}
                type="text"
                className="mt-3 me-3 w-100"
                onChange={(e) => handeleReferrerChange(e)}
              />
            </div>
            <Button
              variant="contained"
              onClick={addReferrer}
              className="mt-4 w-100 border-radius connect-btn "
            >
              <h6 className="p-2">Add referral</h6>
            </Button>
          </div>
          <div className="mb-3">
            <h2 className="text-black mb-3">Pay referral</h2>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="select-label">Plan</InputLabel>
                <Select
                  value={planName}
                  label="Plan"
                  onChange={handlePlanchange}
                >
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              onClick={payReferrer}
              className="mt-3 w-100 border-radius connect-btn "
            >
              <h6 className="p-2">Pay now</h6>
            </Button>
          </div>
          {/* <div className="mb-3">
            <h2 className="text-black">Allowance</h2>
            <Button
              variant="contained"
              onClick={allowance}
              className="mt-3 w-100 border-radius connect-btn "
            >
              <h6 className="p-2">{approved ? "Approved" : "Approve"} </h6>
            </Button>
          </div> */}
        </Col>
      </Col>
      <Col lg={{ span: 8 }} className="p-5">
        <Col className="border-radius chain-details mb-5">
          <h2 className="text-black mb-3">User details</h2>
          <Row className="mb-3">
            <Row span={4} className="d-flex ">
              <div className="chain-logo">
                <img
                  height="100%"
                  width="100%"
                  className="object-fit-contain"
                  src={CHAIN_LOGO}
                  alt="chain-logo"
                />
              </div>
              <Col span={20} className="ms-2">
                <h3 className="text-black">Wallet Address</h3>
                <h5 className="address">
                  {account}
                </h5>
              </Col>
            </Row>
          </Row>
          <Divider></Divider>
          <Row span={4} className="d-flex ">
            <div className="chain-logo">
              <img
                height="100%"
                width="100%"
                className="object-fit-contain"
                src={WALLET}
                alt="chain-logo"
              />
            </div>
            <Col span={20} className="ms-3 mb-3">
              {/* <div className="d-flex mb-2">
                <h5 className="text-black ">Coin balance&nbsp;&nbsp;</h5>
                <h5 className="coins ms-3">{""}</h5>
              </div> */}
              <div className="d-flex align-items-center mb-2">
                <h5 className="text-black">Token balance :</h5>
                <Button
                  variant="contained"
                  className="w-10 mb-2"
                  onClick={getBalance}
                >
                  check balance
                </Button>
                <h5 className="tokens ms-3">{tokenBalance} tokens</h5>
              </div>
            </Col>
            <Button
              variant="contained"
              className="w-100 mb-2"
              onClick={handleOpen}
            >
              Get more tokens
            </Button>
          </Row>
        </Col>
      </Col>
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
              className="mt-4 w-100 border-radius connect-btn "
            >
              <h6 className="p-2">Buy Now</h6>
            </Button>
          </div>
          <Button onClick={handleClose}>close</Button>
        </Box>
      </Modal>
      <Col lg={{ span: 8 }} className="p-5">
        <Col lg={{ span: 24 }} className="chain-details border-radius">
          <h2 className="text-black">Network configuration</h2>
          <div className="flex-and-between">
            {map(inputs, (input) => (
              <TextField
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
              className="mt-4 w-100 border-radius connect-btn "
            >
              <h6 className="p-2">{connected ? "Connected" : "Connect"} </h6>
            </Button>
          </div>
          <h2 className="text-black mt-3">Faucet</h2>
          <TextField
            id="outlined-text-input"
            label={"Address"}
            type="text"
            onChange={handleFaucetAddress}
            className="mt-3 w-100"
          />
          <Button
            variant="contained"
            onClick={getCalib}
            className="mt-4 w-100 border-radius connect-btn "
          >
            <h6 className="p-2">Hit Faucet</h6>
          </Button>
        </Col>
      </Col>
    </Row>
  );
};
export default Landing;
