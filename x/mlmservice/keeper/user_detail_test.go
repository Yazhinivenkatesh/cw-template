package keeper_test

import (
	"strconv"
	"testing"

	keepertest "github.com/calibchain/mlmservice/testutil/keeper"
	"github.com/calibchain/mlmservice/testutil/nullify"
	"github.com/calibchain/mlmservice/x/mlmservice/keeper"
	"github.com/calibchain/mlmservice/x/mlmservice/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNUserDetail(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.UserDetail {
	items := make([]types.UserDetail, n)
	for i := range items {
		items[i].Index = strconv.Itoa(i)

		keeper.SetUserDetail(ctx, items[i])
	}
	return items
}

func TestUserDetailGet(t *testing.T) {
	keeper, ctx := keepertest.MlmserviceKeeper(t)
	items := createNUserDetail(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetUserDetail(ctx,
			item.Index,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestUserDetailRemove(t *testing.T) {
	keeper, ctx := keepertest.MlmserviceKeeper(t)
	items := createNUserDetail(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveUserDetail(ctx,
			item.Index,
		)
		_, found := keeper.GetUserDetail(ctx,
			item.Index,
		)
		require.False(t, found)
	}
}

func TestUserDetailGetAll(t *testing.T) {
	keeper, ctx := keepertest.MlmserviceKeeper(t)
	items := createNUserDetail(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllUserDetail(ctx)),
	)
}
