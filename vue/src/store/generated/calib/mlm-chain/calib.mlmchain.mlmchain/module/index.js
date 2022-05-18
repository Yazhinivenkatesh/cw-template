// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT MODIFY.
import { SigningStargateClient } from "@cosmjs/stargate";
import { Registry } from "@cosmjs/proto-signing";
import { Api } from "./rest";
import { MsgBuyName } from "./types/mlmchain/tx";
import { MsgSetName } from "./types/mlmchain/tx";
const types = [
    ["/calib.mlmchain.mlmchain.MsgBuyName", MsgBuyName],
    ["/calib.mlmchain.mlmchain.MsgSetName", MsgSetName],
];
export const MissingWalletError = new Error("wallet is required");
export const registry = new Registry(types);
const defaultFee = {
    amount: [],
    gas: "200000",
};
const txClient = async (wallet, { addr: addr } = { addr: "http://localhost:26657" }) => {
    if (!wallet)
        throw MissingWalletError;
    let client;
    if (addr) {
        client = await SigningStargateClient.connectWithSigner(addr, wallet, { registry });
    }
    else {
        client = await SigningStargateClient.offline(wallet, { registry });
    }
    const { address } = (await wallet.getAccounts())[0];
    return {
        signAndBroadcast: (msgs, { fee, memo } = { fee: defaultFee, memo: "" }) => client.signAndBroadcast(address, msgs, fee, memo),
        msgBuyName: (data) => ({ typeUrl: "/calib.mlmchain.mlmchain.MsgBuyName", value: MsgBuyName.fromPartial(data) }),
        msgSetName: (data) => ({ typeUrl: "/calib.mlmchain.mlmchain.MsgSetName", value: MsgSetName.fromPartial(data) }),
    };
};
const queryClient = async ({ addr: addr } = { addr: "http://localhost:1317" }) => {
    return new Api({ baseUrl: addr });
};
export { txClient, queryClient, };
