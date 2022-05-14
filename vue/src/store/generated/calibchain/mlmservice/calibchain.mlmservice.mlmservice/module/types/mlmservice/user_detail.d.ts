import { Writer, Reader } from "protobufjs/minimal";
export declare const protobufPackage = "calibchain.mlmservice.mlmservice";
export interface UserDetail {
    index: string;
    userName: string;
    referrerId: string;
}
export declare const UserDetail: {
    encode(message: UserDetail, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): UserDetail;
    fromJSON(object: any): UserDetail;
    toJSON(message: UserDetail): unknown;
    fromPartial(object: DeepPartial<UserDetail>): UserDetail;
};
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
