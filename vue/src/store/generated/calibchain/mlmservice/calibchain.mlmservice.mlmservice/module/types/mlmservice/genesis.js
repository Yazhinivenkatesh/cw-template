/* eslint-disable */
import { Params } from "../mlmservice/params";
import { UserDetail } from "../mlmservice/user_detail";
import { Writer, Reader } from "protobufjs/minimal";
export const protobufPackage = "calibchain.mlmservice.mlmservice";
const baseGenesisState = {};
export const GenesisState = {
    encode(message, writer = Writer.create()) {
        if (message.params !== undefined) {
            Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.userDetailList) {
            UserDetail.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseGenesisState };
        message.userDetailList = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.params = Params.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.userDetailList.push(UserDetail.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseGenesisState };
        message.userDetailList = [];
        if (object.params !== undefined && object.params !== null) {
            message.params = Params.fromJSON(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.userDetailList !== undefined && object.userDetailList !== null) {
            for (const e of object.userDetailList) {
                message.userDetailList.push(UserDetail.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.params !== undefined &&
            (obj.params = message.params ? Params.toJSON(message.params) : undefined);
        if (message.userDetailList) {
            obj.userDetailList = message.userDetailList.map((e) => e ? UserDetail.toJSON(e) : undefined);
        }
        else {
            obj.userDetailList = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseGenesisState };
        message.userDetailList = [];
        if (object.params !== undefined && object.params !== null) {
            message.params = Params.fromPartial(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.userDetailList !== undefined && object.userDetailList !== null) {
            for (const e of object.userDetailList) {
                message.userDetailList.push(UserDetail.fromPartial(e));
            }
        }
        return message;
    },
};
