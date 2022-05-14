package keeper_test

import (
	"context"
	"testing"

	keepertest "github.com/calibchain/mlmservice/testutil/keeper"
	"github.com/calibchain/mlmservice/x/mlmservice/keeper"
	"github.com/calibchain/mlmservice/x/mlmservice/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func setupMsgServer(t testing.TB) (types.MsgServer, context.Context) {
	k, ctx := keepertest.MlmserviceKeeper(t)
	return keeper.NewMsgServerImpl(*k), sdk.WrapSDKContext(ctx)
}
