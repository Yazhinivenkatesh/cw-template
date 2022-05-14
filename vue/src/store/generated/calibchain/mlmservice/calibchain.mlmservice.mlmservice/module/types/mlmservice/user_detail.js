/* eslint-disable */
import { Writer, Reader } from "protobufjs/minimal";
export const protobufPackage = "calibchain.mlmservice.mlmservice";
const baseUserDetail = { index: "", userName: "", referrerId: "" };
export const UserDetail = {
    encode(message, writer = Writer.create()) {
        if (message.index !== "") {
            writer.uint32(10).string(message.index);
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
        const message = { ...baseUserDetail };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.index = reader.string();
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
        const message = { ...baseUserDetail };
        if (object.index !== undefined && object.index !== null) {
            message.index = String(object.index);
        }
        else {
            message.index = "";
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
        message.index !== undefined && (obj.index = message.index);
        message.userName !== undefined && (obj.userName = message.userName);
        message.referrerId !== undefined && (obj.referrerId = message.referrerId);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseUserDetail };
        if (object.index !== undefined && object.index !== null) {
            message.index = object.index;
        }
        else {
            message.index = "";
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
