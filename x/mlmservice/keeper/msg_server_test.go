package keeper_test

import (
	"context"
	"testing"

	keepertest "github.com/calib/mlm-chain/testutil/keeper"
	"github.com/calib/mlm-chain/x/mlmservice/keeper"
	"github.com/calib/mlm-chain/x/mlmservice/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func setupMsgServer(t testing.TB) (types.MsgServer, context.Context) {
	k, ctx := keepertest.MlmserviceKeeper(t)
	return keeper.NewMsgServerImpl(*k), sdk.WrapSDKContext(ctx)
}
