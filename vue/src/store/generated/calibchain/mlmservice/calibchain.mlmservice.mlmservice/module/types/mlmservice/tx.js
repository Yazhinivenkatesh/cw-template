/* eslint-disable */
import { Reader, Writer } from "protobufjs/minimal";
export const protobufPackage = "calibchain.mlmservice.mlmservice";
const baseMsgAddUser = { creator: "", userName: "", referrerId: "" };
export const MsgAddUser = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== "") {
            writer.uint32(10).string(message.creator);
        }
        if (message.userName !== "") {
            writer.uint32(18).string(message.userName);
        }
        if (message.referrerId !== "") {
            writer.uint32(26).string(message.referrerId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgAddUser };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.userName = reader.string();
                    break;
                case 3:
                    message.referrerId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgAddUser };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = "";
        }
        if (object.userName !== undefined && object.userName !== null) {
            message.userName = String(object.userName);
        }
        else {
            message.userName = "";
        }
        if (object.referrerId !== undefined && object.referrerId !== null) {
            message.referrerId = String(object.referrerId);
        }
        else {
            message.referrerId = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.userName !== undefined && (obj.userName = message.userName);
        message.referrerId !== undefined && (obj.referrerId = message.referrerId);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgAddUser };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = "";
        }
        if (object.userName !== undefined && object.userName !== null) {
            message.userName = object.userName;
        }
        else {
            message.userName = "";
        }
        if (object.referrerId !== undefined && object.referrerId !== null) {
            message.referrerId = object.referrerId;
        }
        else {
            message.referrerId = "";
        }
        return message;
    },
};
const baseMsgAddUserResponse = {};
export const MsgAddUserResponse = {
    encode(_, writer = Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgAddUserResponse };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = { ...baseMsgAddUserResponse };
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = { ...baseMsgAddUserResponse };
        return message;
    },
};
export class MsgClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
    }
    AddUser(request) {
        const data = MsgAddUser.encode(request).finish();
        const promise = this.rpc.request("calibchain.mlmservice.mlmservice.Msg", "AddUser", data);
        return promise.then((data) => MsgAddUserResponse.decode(new Reader(data)));
    }
}
