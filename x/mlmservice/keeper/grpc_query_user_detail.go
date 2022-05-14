package keeper

import (
	"context"

	"github.com/calibchain/mlmservice/x/mlmservice/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) UserDetailAll(c context.Context, req *types.QueryAllUserDetailRequest) (*types.QueryAllUserDetailResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var userDetails []types.UserDetail
	ctx := sdk.UnwrapSDKContext(c)

	store := ctx.KVStore(k.storeKey)
	userDetailStore := prefix.NewStore(store, types.KeyPrefix(types.UserDetailKeyPrefix))

	pageRes, err := query.Paginate(userDetailStore, req.Pagination, func(key []byte, value []byte) error {
		var userDetail types.UserDetail
		if err := k.cdc.Unmarshal(value, &userDetail); err != nil {
			return err
		}

		userDetails = append(userDetails, userDetail)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllUserDetailResponse{UserDetail: userDetails, Pagination: pageRes}, nil
}

func (k Keeper) UserDetail(c context.Context, req *types.QueryGetUserDetailRequest) (*types.QueryGetUserDetailResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	val, found := k.GetUserDetail(
		ctx,
		req.Index,
	)
	if !found {
		return nil, status.Error(codes.InvalidArgument, "not found")
	}

	return &types.QueryGetUserDetailResponse{UserDetail: val}, nil
}
