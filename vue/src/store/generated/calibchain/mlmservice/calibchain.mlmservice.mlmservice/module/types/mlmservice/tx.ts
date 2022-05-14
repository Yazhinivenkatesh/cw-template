/* eslint-disable */
import { Reader, Writer } from "protobufjs/minimal";

export const protobufPackage = "calibchain.mlmservice.mlmservice";

export interface MsgAddUser {
  creator: string;
  userName: string;
  referrerId: string;
}

export interface MsgAddUserResponse {}

const baseMsgAddUser: object = { creator: "", userName: "", referrerId: "" };

export const MsgAddUser = {
  encode(message: MsgAddUser, writer: Writer = Writer.create()): Writer {
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

  decode(input: Reader | Uint8Array, length?: number): MsgAddUser {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgAddUser } as MsgAddUser;
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

  fromJSON(object: any): MsgAddUser {
    const message = { ...baseMsgAddUser } as MsgAddUser;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator);
    } else {
      message.creator = "";
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

  toJSON(message: MsgAddUser): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.userName !== undefined && (obj.userName = message.userName);
    message.referrerId !== undefined && (obj.referrerId = message.referrerId);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgAddUser>): MsgAddUser {
    const message = { ...baseMsgAddUser } as MsgAddUser;
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator;
    } else {
      message.creator = "";
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

const baseMsgAddUserResponse: object = {};

export const MsgAddUserResponse = {
  encode(_: MsgAddUserResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgAddUserResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgAddUserResponse } as MsgAddUserResponse;
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

  fromJSON(_: any): MsgAddUserResponse {
    const message = { ...baseMsgAddUserResponse } as MsgAddUserResponse;
    return message;
  },

  toJSON(_: MsgAddUserResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgAddUserResponse>): MsgAddUserResponse {
    const message = { ...baseMsgAddUserResponse } as MsgAddUserResponse;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  /** this line is used by starport scaffolding # proto/tx/rpc */
  AddUser(request: MsgAddUser): Promise<MsgAddUserResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  AddUser(request: MsgAddUser): Promise<MsgAddUserResponse> {
    const data = MsgAddUser.encode(request).finish();
    const promise = this.rpc.request(
      "calibchain.mlmservice.mlmservice.Msg",
      "AddUser",
      data
    );
    return promise.then((data) => MsgAddUserResponse.decode(new Reader(data)));
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

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
