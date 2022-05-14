package keeper_test

import (
	"testing"

	testkeeper "github.com/calibchain/mlmservice/testutil/keeper"
	"github.com/calibchain/mlmservice/x/mlmservice/types"
	"github.com/stretchr/testify/require"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.MlmserviceKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
