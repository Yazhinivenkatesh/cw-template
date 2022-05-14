package mlmservice

import (
	"github.com/calibchain/mlmservice/x/mlmservice/keeper"
	"github.com/calibchain/mlmservice/x/mlmservice/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// InitGenesis initializes the capability module's state from a provided genesis
// state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	// Set all the userDetail
	for _, elem := range genState.UserDetailList {
		k.SetUserDetail(ctx, elem)
	}
	// this line is used by starport scaffolding # genesis/module/init
	k.SetParams(ctx, genState.Params)
}

// ExportGenesis returns the capability module's exported genesis.
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)

	genesis.UserDetailList = k.GetAllUserDetail(ctx)
	// this line is used by starport scaffolding # genesis/module/export

	return genesis
}
