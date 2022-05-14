package mlmservice_test

import (
	"testing"

	keepertest "github.com/calibchain/mlmservice/testutil/keeper"
	"github.com/calibchain/mlmservice/testutil/nullify"
	"github.com/calibchain/mlmservice/x/mlmservice"
	"github.com/calibchain/mlmservice/x/mlmservice/types"
	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		UserDetailList: []types.UserDetail{
			{
				Index: "0",
			},
			{
				Index: "1",
			},
		},
		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.MlmserviceKeeper(t)
	mlmservice.InitGenesis(ctx, *k, genesisState)
	got := mlmservice.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.ElementsMatch(t, genesisState.UserDetailList, got.UserDetailList)
	// this line is used by starport scaffolding # genesis/test/assert
}
