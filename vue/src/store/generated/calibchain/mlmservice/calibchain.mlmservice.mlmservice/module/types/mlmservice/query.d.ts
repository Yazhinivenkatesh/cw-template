import { Reader, Writer } from "protobufjs/minimal";
import { Params } from "../mlmservice/params";
import { UserDetail } from "../mlmservice/user_detail";
import { PageRequest, PageResponse } from "../cosmos/base/query/v1beta1/pagination";
export declare const protobufPackage = "calibchain.mlmservice.mlmservice";
/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}
/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
    /** params holds all the parameters of this module. */
    params: Params | undefined;
}
export interface QueryGetUserDetailRequest {
    index: string;
}
export interface QueryGetUserDetailResponse {
    userDetail: UserDetail | undefined;
}
export interface QueryAllUserDetailRequest {
    pagination: PageRequest | undefined;
}
export interface QueryAllUserDetailResponse {
    userDetail: UserDetail[];
    pagination: PageResponse | undefined;
}
export declare const QueryParamsRequest: {
    encode(_: QueryParamsRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryParamsRequest;
    fromJSON(_: any): QueryParamsRequest;
    toJSON(_: QueryParamsRequest): unknown;
    fromPartial(_: DeepPartial<QueryParamsRequest>): QueryParamsRequest;
};
export declare const QueryParamsResponse: {
    encode(message: QueryParamsResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryParamsResponse;
    fromJSON(object: any): QueryParamsResponse;
    toJSON(message: QueryParamsResponse): unknown;
    fromPartial(object: DeepPartial<QueryParamsResponse>): QueryParamsResponse;
};
export declare const QueryGetUserDetailRequest: {
    encode(message: QueryGetUserDetailRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetUserDetailRequest;
    fromJSON(object: any): QueryGetUserDetailRequest;
    toJSON(message: QueryGetUserDetailRequest): unknown;
    fromPartial(object: DeepPartial<QueryGetUserDetailRequest>): QueryGetUserDetailRequest;
};
export declare const QueryGetUserDetailResponse: {
    encode(message: QueryGetUserDetailResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetUserDetailResponse;
    fromJSON(object: any): QueryGetUserDetailResponse;
    toJSON(message: QueryGetUserDetailResponse): unknown;
    fromPartial(object: DeepPartial<QueryGetUserDetailResponse>): QueryGetUserDetailResponse;
};
export declare const QueryAllUserDetailRequest: {
    encode(message: QueryAllUserDetailRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryAllUserDetailRequest;
    fromJSON(object: any): QueryAllUserDetailRequest;
    toJSON(message: QueryAllUserDetailRequest): unknown;
    fromPartial(object: DeepPartial<QueryAllUserDetailRequest>): QueryAllUserDetailRequest;
};
export declare const QueryAllUserDetailResponse: {
    encode(message: QueryAllUserDetailResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryAllUserDetailResponse;
    fromJSON(object: any): QueryAllUserDetailResponse;
    toJSON(message: QueryAllUserDetailResponse): unknown;
    fromPartial(object: DeepPartial<QueryAllUserDetailResponse>): QueryAllUserDetailResponse;
};
/** Query defines the gRPC querier service. */
export interface Query {
    /** Parameters queries the parameters of the module. */
    Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
    /** Queries a UserDetail by index. */
    UserDetail(request: QueryGetUserDetailRequest): Promise<QueryGetUserDetailResponse>;
    /** Queries a list of UserDetail items. */
    UserDetailAll(request: QueryAllUserDetailRequest): Promise<QueryAllUserDetailResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
    UserDetail(request: QueryGetUserDetailRequest): Promise<QueryGetUserDetailResponse>;
    UserDetailAll(request: QueryAllUserDetailRequest): Promise<QueryAllUserDetailResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
