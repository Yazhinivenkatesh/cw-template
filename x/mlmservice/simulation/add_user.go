package simulation

import (
	"math/rand"

	"github.com/calibchain/mlmservice/x/mlmservice/keeper"
	"github.com/calibchain/mlmservice/x/mlmservice/types"
	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
)

func SimulateMsgAddUser(
	ak types.AccountKeeper,
	bk types.BankKeeper,
	k keeper.Keeper,
) simtypes.Operation {
	return func(r *rand.Rand, app *baseapp.BaseApp, ctx sdk.Context, accs []simtypes.Account, chainID string,
	) (simtypes.OperationMsg, []simtypes.FutureOperation, error) {
		simAccount, _ := simtypes.RandomAcc(r, accs)
		msg := &types.MsgAddUser{
			Creator: simAccount.Address.String(),
		}

		// TODO: Handling the AddUser simulation

		return simtypes.NoOpMsg(types.ModuleName, msg.Type(), "AddUser simulation not implemented"), nil, nil
	}
}
