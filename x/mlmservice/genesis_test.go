package mlmservice_test

import (
	"testing"

	keepertest "github.com/calib/mlm-chain/testutil/keeper"
	"github.com/calib/mlm-chain/testutil/nullify"
	"github.com/calib/mlm-chain/x/mlmservice"
	"github.com/calib/mlm-chain/x/mlmservice/types"
	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.MlmserviceKeeper(t)
	mlmservice.InitGenesis(ctx, *k, genesisState)
	got := mlmservice.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	// this line is used by starport scaffolding # genesis/test/assert
}
