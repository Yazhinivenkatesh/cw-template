package mlmchain_test

import (
	"testing"

	keepertest "github.com/calib/mlm-chain/testutil/keeper"
	"github.com/calib/mlm-chain/testutil/nullify"
	"github.com/calib/mlm-chain/x/mlmchain"
	"github.com/calib/mlm-chain/x/mlmchain/types"
	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		WhoisList: []types.Whois{
			{
				Index: "0",
			},
			{
				Index: "1",
			},
		},
		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.MlmchainKeeper(t)
	mlmchain.InitGenesis(ctx, *k, genesisState)
	got := mlmchain.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.ElementsMatch(t, genesisState.WhoisList, got.WhoisList)
	// this line is used by starport scaffolding # genesis/test/assert
}
