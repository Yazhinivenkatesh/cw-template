package keeper_test

import (
	"testing"

	testkeeper "github.com/calib/mlm-chain/testutil/keeper"
	"github.com/calib/mlm-chain/x/mlmchain/types"
	"github.com/stretchr/testify/require"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.MlmchainKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
