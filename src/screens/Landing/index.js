import { React, useState, useEffect } from "react";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { isEmpty, map, template } from "lodash";
import { Col, Divider, Row } from "antd";

import "./landing.css";
import { TextField } from "@mui/material";
import { FaucetClient } from "@cosmjs/faucet-client";
import { suggestChain } from "../../utils/helper";

import axios from "axios";
import { Box, InputLabel, MenuItem, FormControl, Modal, Select, Table, TableBody, TableContainer, TableHead, TableRow, Button, Grid } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { useSelector } from "react-redux";

import 'react-toastify/dist/ReactToastify.css';
import CHAIN_LOGO from "../../assets/chain-logo.png";
import WALLET from "../../assets/wallet.svg";
import { constants } from "../../utils/constants";

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

  
  const walletAddress = useSelector(state => state.rootReducer.wallet.walletAddress)
  console.log("wallet-", walletAddress)
  const tempList = useSelector(state => state.rootReducer.wallet.referralList[0])
  let referralList;
  if(!isEmpty(tempList)){
    referralList = tempList;
  }else{
    referralList = [];
  }
  console.log("REFERRAL", referralList)


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 17,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const defaultBalance = {
    coinBalance: "0 calib",
    tokenBalance: " 0",
  };

  const [referrer, setReferrer] = useState("");
  const [planName, setPlanName] = useState("");
  const [faucetAddress, setFaucetAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [accountBalance, setAccountBalance] = useState(defaultBalance);
  const [txLogs, addTxLogs] = useState([]);
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

  let cwClient, client, accounts, offlineSigner, amount, refList;

  const initialize = async () => {
    await window.keplr.enable(chainData.chainId);
    offlineSigner = window.getOfflineSigner(chainData.chainId);
    const options = {
      gasprice: new GasPrice(10, "calib"),
    };
    const tmClient = await Tendermint34Client.connect("http://localhost:26657");

    cwClient = new SigningCosmWasmClient(tmClient, offlineSigner, options);

    client = await CosmWasmClient.connect(
      "http://localhost:26657",
    )

    // setInitialized(true);
  };

  // useEffect(() => {
  //   setTimeout(
  //     () => getReferralList(), 2000
  //   )
  //   // refList = getReferralList();
  // })

  console.log("REFLIST", refList);

  const addTxLog = (txHash, status, fnName) => {
    txLogs.push({ txHash, status, fnName });
    addTxLogs(txLogs);
  };

  // const getReferralList = async () => {
  //   await initialize();
  //   try {
  //     const response = await client.queryContractSmart(MLM_CONTRACT_ADDRESS, { "get_level_detail": { "address": walletAddress, "level_count": "1" } })
  //     if (response && !isEmpty(response)) {
  //       setReferralList(list => response[0]['referrals'])
  //     }
  //   } catch (e) {
  //     console.log("ERR", e)
  //   }
  // }

  const getCoinBalance = async () => {
    const response = await axios.get(`http://localhost:1317/cosmos/bank/v1beta1/balances/${walletAddress}?pagination.limit=1000`);
    const balance = {
      'coinBalance': response.data.balances[0].amount,
      'tokenBalance': 0
    }
    setAccountBalance(balance);
    await getTokenBalance();
  }

  const getTokenBalance = async () => {
    await initialize();
    const result = await client.queryContractSmart(TOKEN_CONTRACT_ADDRESS, { "balance": { "address": walletAddress } })
    setAccountBalance(prev => ({ ...prev, 'tokenBalance': result.balance }))
  }

  const allowance = async () => {
    try {
      await initialize();
      debugger
      const response = await client.queryContractSmart(TOKEN_CONTRACT_ADDRESS, { "allowance": { "owner": walletAddress, "spender": MLM_CONTRACT_ADDRESS } })
      if (response.allowance === "0") {
        const result = await cwClient.execute(accounts[0].address, TOKEN_CONTRACT_ADDRESS, { "increase_allowance": { "spender": MLM_CONTRACT_ADDRESS, "amount": "10000" } }, stdFee)
        toast.success("APPROVED SUCCESSFULLY" + result.transactionHash);
      }
    } catch (err) {
      const error = err?.message;
      if (error.includes("rejected")) {
        toast.error("USER DENIED TRANSACTION")
      } else {
        toast.error("ERROR WHILE PROVIDING ALLOWANCE")
      }
    }
  };

  const addReferrer = async () => {
    try {
      await initialize();
      const response = await cwClient.execute(
        walletAddress,
        MLM_CONTRACT_ADDRESS,
        { "add_referral": { referrer: referrer } },
        stdFee
      );
      const txHash = response.transactionHash;
      toast.success("REFERRAL ADDED SUCCESSFULLY");
      addTxLog(txHash, "success", "add-referral");
    } catch (err) {
      const error = err?.message
      switch (true) {
        case (error.includes("OWN")):
          toast.error("REFERRAL CANNOT BE HIS OWN REFERRER");
          break;
        case (error.includes("ONE")):
          toast.error("REFERRAL CANNOT BE ONE OF REFERRER UPLINES");
          break;
        case (error.includes("addr_validate")):
          toast.error("INVALID ADDRESS");
          break;
        case (error.includes("rejected")):
          toast.error("USER DENIED TRANSACTION");
          break;
        default:
          toast.error("SOMETHING WENT WRONG, RETRY AFTER SOME TIME")
      }
    }
  };

  const payReferrer = async () => {
    try {
      await initialize();
      const response = await cwClient.execute(
        walletAddress,
        MLM_CONTRACT_ADDRESS,
        { "pay_referral": { plan_name: planName } },
        stdFee
      );
      toast.success("PAID SUCCESSFULLY" + response.transactionHash);
      const txHash = response.transactionHash;
      addTxLog(txHash, "success", "pay-referral");
    } catch (err) {
      const error = err?.message;
      switch (true) {
        case (error.includes("exist")):
          toast.error("PLAN DOES NOT EXIST");
          break;
        case (error.includes("ALREADY")):
          toast.error("USER ALREADY PAID");
          break;
        case (error.includes("ENOUGH")):
          toast.error("USER BALANCE IS NOT ENOUGH");
          break;
        case (error.includes("rejected")):
          toast.error("USER DENIED TRANSACTION");
          break;
        case (error.includes("allowance")):
          allowance();
          break;
        default:
          toast.error("SOMETHING WENT WRONG, RETRY AFTER SOME TIME");
      }
    }
  };

  const buyTokens = async () => {
    let txHash;
    debugger
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
        txHash = result.transactionHash;
        addTxLog(txHash, "success", "sent-coins");
        toast.success("SUCCESSFULLY SENT CALIB COINS");

        const response = await cwClient.execute(
          walletAddress,
          MLM_CONTRACT_ADDRESS,
          { "buy_tokens": { amount_to_buy: amount.toString() } },
          stdFee
        );
        txHash = response.transactionHash;
        addTxLog(txHash, "success", "buy-tokens");
        toast.success("TOKENS BOUGHT SUCCESSFULLY");
      } else {
        toast.error("TRANSACTION FAILED: USER DOES NOT HAVE ENOUGH COINS TO SEND !");
      }
    } catch (err) {
      const error = err?.message;
      if (error.includes("rejected")) {
        toast.error("USER DENIED TRANSACTION");
      } else {
        toast.error("SOMETHING WENT WRONG, RETRY AFTER SOME TIME")
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

  return (
    <div className="flex-and-c">
      <ToastContainer />
      <Grid container>

        <Grid item xs="12" md="6" lg="4" className="p-5">
          <div className="border-radius chain-details">
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
          </div>
        </Grid>

        <Grid item xs="12" md="6" lg="4" className="p-5">
          <Grid className="border-radius chain-details mb-5">
            <h2 className="text-black mb-3">User details</h2>
            <Grid className="mb-3">
              <Grid span={4} className="d-flex ">
                <div className="chain-logo">
                  <img
                    height="100%"
                    width="100%"
                    className="object-fit-contain"
                    src={CHAIN_LOGO}
                    alt="chain-logo"
                  />
                </div>
                <Grid span={20} className="ms-2">
                  <h3 className="text-black">Wallet Address</h3>
                  <h5 className="address">
                    {walletAddress}
                  </h5>
                </Grid>
              </Grid>
            </Grid>
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
                <div className="d-flex mb-2">
                  <h5 className="text-black ">Coin balance :</h5>
                  <h5 className="coins ms-3">{accountBalance.coinBalance} coins</h5>

                </div>
                <div className="d-flex align-items-center mb-2">
                  <h5 className="text-black">Token balance :</h5>
                  <h5 className="tokens ms-3">{accountBalance.tokenBalance} tokens</h5>
                </div>
              </Col>
              <Button
                variant="contained"
                className="w-50 mb-2"
                onClick={getCoinBalance}
              >
                check balance
              </Button>
              <Button
                variant="contained"
                className="w-50 mb-2"
                onClick={handleOpen}
              >
                Get more tokens
              </Button>
            </Row>
          </Grid>
        </Grid>

        <Grid item xs="12" md="6" lg="4" className="p-5">
          <Grid lg={{ span: 24 }} className="chain-details border-radius">
            <h2 className="text-black">Network configuration</h2>
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
          </Grid>
        </Grid>
      </Grid>

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

      {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 100 }} aria-label="customized table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Wallet Address</StyledTableCell>
              <StyledTableCell>Amount Received</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {referralList.map((referral, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell>{referral.referral}</StyledTableCell>
                <StyledTableCell>{referral['amount_paid']}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </div>
  );
};
export default Landing;
