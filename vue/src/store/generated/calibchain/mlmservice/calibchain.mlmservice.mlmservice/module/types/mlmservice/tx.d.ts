import { Reader, Writer } from "protobufjs/minimal";
export declare const protobufPackage = "calibchain.mlmservice.mlmservice";
export interface MsgAddUser {
    creator: string;
    userName: string;
    referrerId: string;
}
export interface MsgAddUserResponse {
}
export declare const MsgAddUser: {
    encode(message: MsgAddUser, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgAddUser;
    fromJSON(object: any): MsgAddUser;
    toJSON(message: MsgAddUser): unknown;
    fromPartial(object: DeepPartial<MsgAddUser>): MsgAddUser;
};
export declare const MsgAddUserResponse: {
    encode(_: MsgAddUserResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgAddUserResponse;
    fromJSON(_: any): MsgAddUserResponse;
    toJSON(_: MsgAddUserResponse): unknown;
    fromPartial(_: DeepPartial<MsgAddUserResponse>): MsgAddUserResponse;
};
/** Msg defines the Msg service. */
export interface Msg {
    /** this line is used by starport scaffolding # proto/tx/rpc */
    AddUser(request: MsgAddUser): Promise<MsgAddUserResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    AddUser(request: MsgAddUser): Promise<MsgAddUserResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
