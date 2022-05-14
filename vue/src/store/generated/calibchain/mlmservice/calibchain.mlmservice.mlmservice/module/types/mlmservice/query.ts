/* eslint-disable */
import { Reader, Writer } from "protobufjs/minimal";
import { Params } from "../mlmservice/params";
import { UserDetail } from "../mlmservice/user_detail";
import {
  PageRequest,
  PageResponse,
} from "../cosmos/base/query/v1beta1/pagination";

export const protobufPackage = "calibchain.mlmservice.mlmservice";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}

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

const baseQueryParamsRequest: object = {};

export const QueryParamsRequest = {
  encode(_: QueryParamsRequest, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
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

  fromJSON(_: any): QueryParamsRequest {
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    return message;
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryParamsRequest>): QueryParamsRequest {
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    return message;
  },
};

const baseQueryParamsResponse: object = {};

export const QueryParamsResponse = {
  encode(
    message: QueryParamsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryParamsResponse {
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryParamsResponse>): QueryParamsResponse {
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },
};

const baseQueryGetUserDetailRequest: object = { index: "" };

export const QueryGetUserDetailRequest = {
  encode(
    message: QueryGetUserDetailRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetUserDetailRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetUserDetailRequest,
    } as QueryGetUserDetailRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetUserDetailRequest {
    const message = {
      ...baseQueryGetUserDetailRequest,
    } as QueryGetUserDetailRequest;
    if (object.index !== undefined && object.index !== null) {
      message.index = String(object.index);
    } else {
      message.index = "";
    }
    return message;
  },

  toJSON(message: QueryGetUserDetailRequest): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetUserDetailRequest>
  ): QueryGetUserDetailRequest {
    const message = {
      ...baseQueryGetUserDetailRequest,
    } as QueryGetUserDetailRequest;
    if (object.index !== undefined && object.index !== null) {
      message.index = object.index;
    } else {
      message.index = "";
    }
    return message;
  },
};

const baseQueryGetUserDetailResponse: object = {};

export const QueryGetUserDetailResponse = {
  encode(
    message: QueryGetUserDetailResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.userDetail !== undefined) {
      UserDetail.encode(message.userDetail, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryGetUserDetailResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetUserDetailResponse,
    } as QueryGetUserDetailResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userDetail = UserDetail.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetUserDetailResponse {
    const message = {
      ...baseQueryGetUserDetailResponse,
    } as QueryGetUserDetailResponse;
    if (object.userDetail !== undefined && object.userDetail !== null) {
      message.userDetail = UserDetail.fromJSON(object.userDetail);
    } else {
      message.userDetail = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetUserDetailResponse): unknown {
    const obj: any = {};
    message.userDetail !== undefined &&
      (obj.userDetail = message.userDetail
        ? UserDetail.toJSON(message.userDetail)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetUserDetailResponse>
  ): QueryGetUserDetailResponse {
    const message = {
      ...baseQueryGetUserDetailResponse,
    } as QueryGetUserDetailResponse;
    if (object.userDetail !== undefined && object.userDetail !== null) {
      message.userDetail = UserDetail.fromPartial(object.userDetail);
    } else {
      message.userDetail = undefined;
    }
    return message;
  },
};

const baseQueryAllUserDetailRequest: object = {};

export const QueryAllUserDetailRequest = {
  encode(
    message: QueryAllUserDetailRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryAllUserDetailRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllUserDetailRequest,
    } as QueryAllUserDetailRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllUserDetailRequest {
    const message = {
      ...baseQueryAllUserDetailRequest,
    } as QueryAllUserDetailRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllUserDetailRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllUserDetailRequest>
  ): QueryAllUserDetailRequest {
    const message = {
      ...baseQueryAllUserDetailRequest,
    } as QueryAllUserDetailRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryAllUserDetailResponse: object = {};

export const QueryAllUserDetailResponse = {
  encode(
    message: QueryAllUserDetailResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.userDetail) {
      UserDetail.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryAllUserDetailResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryAllUserDetailResponse,
    } as QueryAllUserDetailResponse;
    message.userDetail = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userDetail.push(UserDetail.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllUserDetailResponse {
    const message = {
      ...baseQueryAllUserDetailResponse,
    } as QueryAllUserDetailResponse;
    message.userDetail = [];
    if (object.userDetail !== undefined && object.userDetail !== null) {
      for (const e of object.userDetail) {
        message.userDetail.push(UserDetail.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryAllUserDetailResponse): unknown {
    const obj: any = {};
    if (message.userDetail) {
      obj.userDetail = message.userDetail.map((e) =>
        e ? UserDetail.toJSON(e) : undefined
      );
    } else {
      obj.userDetail = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryAllUserDetailResponse>
  ): QueryAllUserDetailResponse {
    const message = {
      ...baseQueryAllUserDetailResponse,
    } as QueryAllUserDetailResponse;
    message.userDetail = [];
    if (object.userDetail !== undefined && object.userDetail !== null) {
      for (const e of object.userDetail) {
        message.userDetail.push(UserDetail.fromPartial(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Queries a UserDetail by index. */
  UserDetail(
    request: QueryGetUserDetailRequest
  ): Promise<QueryGetUserDetailResponse>;
  /** Queries a list of UserDetail items. */
  UserDetailAll(
    request: QueryAllUserDetailRequest
  ): Promise<QueryAllUserDetailResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "calibchain.mlmservice.mlmservice.Query",
      "Params",
      data
    );
    return promise.then((data) => QueryParamsResponse.decode(new Reader(data)));
  }

  UserDetail(
    request: QueryGetUserDetailRequest
  ): Promise<QueryGetUserDetailResponse> {
    const data = QueryGetUserDetailRequest.encode(request).finish();
    const promise = this.rpc.request(
      "calibchain.mlmservice.mlmservice.Query",
      "UserDetail",
      data
    );
    return promise.then((data) =>
      QueryGetUserDetailResponse.decode(new Reader(data))
    );
  }

  UserDetailAll(
    request: QueryAllUserDetailRequest
  ): Promise<QueryAllUserDetailResponse> {
    const data = QueryAllUserDetailRequest.encode(request).finish();
    const promise = this.rpc.request(
      "calibchain.mlmservice.mlmservice.Query",
      "UserDetailAll",
      data
    );
    return promise.then((data) =>
      QueryAllUserDetailResponse.decode(new Reader(data))
    );
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
