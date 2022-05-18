package keeper_test

import (
	"testing"

	testkeeper "github.com/calib/mlm-chain/testutil/keeper"
	"github.com/calib/mlm-chain/x/mlmservice/types"
	"github.com/stretchr/testify/require"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.MlmserviceKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
