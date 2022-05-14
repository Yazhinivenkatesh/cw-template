package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	keepertest "github.com/calibchain/mlmservice/testutil/keeper"
	"github.com/calibchain/mlmservice/testutil/nullify"
	"github.com/calibchain/mlmservice/x/mlmservice/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestUserDetailQuerySingle(t *testing.T) {
	keeper, ctx := keepertest.MlmserviceKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	msgs := createNUserDetail(keeper, ctx, 2)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryGetUserDetailRequest
		response *types.QueryGetUserDetailResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryGetUserDetailRequest{
				Index: msgs[0].Index,
			},
			response: &types.QueryGetUserDetailResponse{UserDetail: msgs[0]},
		},
		{
			desc: "Second",
			request: &types.QueryGetUserDetailRequest{
				Index: msgs[1].Index,
			},
			response: &types.QueryGetUserDetailResponse{UserDetail: msgs[1]},
		},
		{
			desc: "KeyNotFound",
			request: &types.QueryGetUserDetailRequest{
				Index: strconv.Itoa(100000),
			},
			err: status.Error(codes.InvalidArgument, "not found"),
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.UserDetail(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				require.Equal(t,
					nullify.Fill(tc.response),
					nullify.Fill(response),
				)
			}
		})
	}
}

func TestUserDetailQueryPaginated(t *testing.T) {
	keeper, ctx := keepertest.MlmserviceKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	msgs := createNUserDetail(keeper, ctx, 5)

	request := func(next []byte, offset, limit uint64, total bool) *types.QueryAllUserDetailRequest {
		return &types.QueryAllUserDetailRequest{
			Pagination: &query.PageRequest{
				Key:        next,
				Offset:     offset,
				Limit:      limit,
				CountTotal: total,
			},
		}
	}
	t.Run("ByOffset", func(t *testing.T) {
		step := 2
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.UserDetailAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.UserDetail), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.UserDetail),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.UserDetailAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.UserDetail), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.UserDetail),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.UserDetailAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.UserDetail),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.UserDetailAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
