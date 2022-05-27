import { React, useState } from "react";
import {
    CosmWasmClient,
    SigningCosmWasmClient
} from '@cosmjs/cosmwasm-stargate';
import { Registry } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";



const AddReferral = () => {
    const [referrer, setReferrer] = useState('');
    const [planName, setPlanName] = useState('');
    let [amount, setAmount] = useState('');
    const chainId = "calibchain";
    const stdFee = {
        amount: [{
            denom: 'calib',
            amount: '222500',
        }],
        gas: "80000000",
    }
    const mlmContractAddress = "calib1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrq5cvy0v"
    const tokenContractAddress = "calib14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9scdfxd2"
    let cwClient, client, accounts, offlineSigner;

    window.onload = async () => {
        if (!window.getOfflineSigner || !window.keplr) {
            alert("Please install keplr extension");
        }
        await window.keplr.enable(chainId);
        offlineSigner = window.keplr.getOfflineSigner(chainId);
        accounts = await offlineSigner.getAccounts();
    };

    const initialize = async () => {
        await window.keplr.enable(chainId);
        offlineSigner = window.getOfflineSigner(chainId);
        accounts = await offlineSigner.getAccounts();
        const options = {
            Registry,
            gasprice: new GasPrice(10, "calib")
        }
        const tmClient = await Tendermint34Client.connect("http://localhost:26657")

        cwClient = new SigningCosmWasmClient(tmClient, offlineSigner, options)

        client = await CosmWasmClient.connect(
            "http://localhost:26657",
        )
    }

    const allowance = async () => {
        try {
            await initialize();
            console.log(client);
            // const data = await client.queryContractSmart(mlmContractAddress, { "get_all_referral_datas":{} })
            // console.log(data)
            const allowance = await client.queryContractSmart(tokenContractAddress, { "allowance": { "owner": accounts[0].address, "spender": mlmContractAddress } })
            if (allowance.allowance === "0") {
                const res = await cwClient.execute(accounts[0].address, tokenContractAddress, { "increase_allowance": { "spender": mlmContractAddress, "amount": "10000" } }, stdFee)
                alert("Appoved Successfully")
             }
        } catch (err) {
            alert(err)
        }
    }

    const addReferrer = async () => {
        try {
            await initialize();
            const res = await cwClient.execute(accounts[0].address, mlmContractAddress, { "add_referral": { "referrer": referrer } }, stdFee)
            alert("Referral Added Successfully")
        } catch (err) {
            console.log(err)
            const error = err?.message
            alert(error)
        }
    }

    const payReferrer = async () => {
        try {
            await initialize();
            const res = await cwClient.execute(accounts[0].address, mlmContractAddress, { "pay_referral": { "plan_name": planName } }, stdFee)
            console.log(res);
            alert("Paid Successfully")
        } catch (err) {
            console.log(err)
            const error = err?.message
            alert(error)
        }
    }

    const buyTokens = async () => {
        await initialize();
        amount = parseFloat(amount);
        if (isNaN(amount)) {
            alert("Invalid amount");
            return false;
        }

        amount *= 1000000;
        amount = Math.floor(amount);

        const amountFinal = {
            denom: 'calib',
            amount: amount.toString(),
        }

        const result = await cwClient.sendTokens(accounts[0].address, "calib1ays90mvzfr09fqgjet23mmpxvuvnnafpflj74k", [amountFinal], stdFee, "")

        if (result.code !== undefined &&
            result.code !== 0) {
            console.log("FAILED", result);
            alert("Failed to send tx: " + result.log || result.rawLog);
        } else {
            console.log(result);
            alert("Succeed to send tx:" + result.transactionHash);
            const res = await cwClient.execute(accounts[0].address, mlmContractAddress, { "buy_tokens": { "amount_to_buy": amount.toString() } }, stdFee)
            console.log(res);
            if(res.code !== undefined && res.code !== 0){
                alert("Failed to send tx: " + result.log || result.rawLog);
            }else{
                alert("Succeed to send tx:" + result.transactionHash);
            }
        }
    }
    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <h3 className="card-header">
                                <b>ADD REFERRAL</b>
                                <br /><hr />
                                <div className="form-group">
                                    <label htmlFor="referrer" className="control-label">
                                        <h5>Referrer Address</h5>
                                    </label>
                                    <input
                                        type="text"
                                        value={referrer}
                                        onChange={event => setReferrer(event.target.value)}
                                        className="form-control"
                                        placeholder="Enter Referrer Address"
                                    />
                                </div>
                                <div className="card-footer">
                                    <button type="submit" className="btn btn-primary"
                                        onClick={addReferrer}>
                                        Accept Invitation
                                    </button>
                                </div>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <h3 className="card-header">
                                <b>PAY REFERRAL</b>
                                <br /><hr />
                                <div className="form-group">
                                    <br />
                                    <select
                                        value={planName}
                                        onChange={event => setPlanName(event.target.value)}>
                                        <option value="select">select-plan</option>
                                        <option value="Basic">Basic</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Premium">Premium</option>
                                    </select>
                                </div>
                                <div className="card-footer">
                                    <button type="submit" className="btn btn-primary"
                                        onClick={payReferrer}>
                                        Pay
                                    </button>
                                    <br />
                                    <hr />
                                    <button type="submit" className="btn btn-primary"
                                        data-toggle="modal" data-target="#exampleModalCenter">
                                        Buy Tokens
                                    </button>
                                    <br />
                                    <hr />
                                    <button type="submit" className="btn btn-primary"
                                        onClick={allowance}>
                                        approve
                                    </button>
                                </div>
                                <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <b className="modal-title" id="exampleModalLongTitle">Buy Tokens</b>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="form-group">
                                                    <label htmlFor="amount" className="control-label">
                                                        <h5>Amount To Buy</h5>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={amount}
                                                        onChange={event => setAmount(event.target.value)}
                                                        className="form-control"
                                                        placeholder="Enter Amount"
                                                    />
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                    <button type="button" className="btn btn-primary" onClick={buyTokens}>Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AddReferral;
