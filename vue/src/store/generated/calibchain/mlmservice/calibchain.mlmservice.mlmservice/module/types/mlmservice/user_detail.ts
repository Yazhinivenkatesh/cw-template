/* eslint-disable */
import { Writer, Reader } from "protobufjs/minimal";

export const protobufPackage = "calibchain.mlmservice.mlmservice";

export interface UserDetail {
  index: string;
  userName: string;
  referrerId: string;
}

const baseUserDetail: object = { index: "", userName: "", referrerId: "" };

export const UserDetail = {
  encode(message: UserDetail, writer: Writer = Writer.create()): Writer {
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

  decode(input: Reader | Uint8Array, length?: number): UserDetail {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserDetail } as UserDetail;
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

  fromJSON(object: any): UserDetail {
    const message = { ...baseUserDetail } as UserDetail;
    if (object.index !== undefined && object.index !== null) {
      message.index = String(object.index);
    } else {
      message.index = "";
    }
    if (object.userName !== undefined && object.userName !== null) {
      message.userName = String(object.userName);
    } else {
      message.userName = "";
    }
    if (object.referrerId !== undefined && object.referrerId !== null) {
      message.referrerId = String(object.referrerId);
    } else {
      message.referrerId = "";
    }
    return message;
  },

  toJSON(message: UserDetail): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index);
    message.userName !== undefined && (obj.userName = message.userName);
    message.referrerId !== undefined && (obj.referrerId = message.referrerId);
    return obj;
  },

  fromPartial(object: DeepPartial<UserDetail>): UserDetail {
    const message = { ...baseUserDetail } as UserDetail;
    if (object.index !== undefined && object.index !== null) {
      message.index = object.index;
    } else {
      message.index = "";
    }
    if (object.userName !== undefined && object.userName !== null) {
      message.userName = object.userName;
    } else {
      message.userName = "";
    }
    if (object.referrerId !== undefined && object.referrerId !== null) {
      message.referrerId = object.referrerId;
    } else {
      message.referrerId = "";
    }
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
