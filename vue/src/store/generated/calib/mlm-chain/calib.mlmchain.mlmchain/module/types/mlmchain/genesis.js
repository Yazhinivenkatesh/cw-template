/* eslint-disable */
import { Params } from "../mlmchain/params";
import { Whois } from "../mlmchain/whois";
import { Writer, Reader } from "protobufjs/minimal";
export const protobufPackage = "calib.mlmchain.mlmchain";
const baseGenesisState = {};
export const GenesisState = {
    encode(message, writer = Writer.create()) {
        if (message.params !== undefined) {
            Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.whoisList) {
            Whois.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseGenesisState };
        message.whoisList = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.params = Params.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.whoisList.push(Whois.decode(reader, reader.uint32()));
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
        message.whoisList = [];
        if (object.params !== undefined && object.params !== null) {
            message.params = Params.fromJSON(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.whoisList !== undefined && object.whoisList !== null) {
            for (const e of object.whoisList) {
                message.whoisList.push(Whois.fromJSON(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.params !== undefined &&
            (obj.params = message.params ? Params.toJSON(message.params) : undefined);
        if (message.whoisList) {
            obj.whoisList = message.whoisList.map((e) => e ? Whois.toJSON(e) : undefined);
        }
        else {
            obj.whoisList = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseGenesisState };
        message.whoisList = [];
        if (object.params !== undefined && object.params !== null) {
            message.params = Params.fromPartial(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.whoisList !== undefined && object.whoisList !== null) {
            for (const e of object.whoisList) {
                message.whoisList.push(Whois.fromPartial(e));
            }
        }
        return message;
    },
};
