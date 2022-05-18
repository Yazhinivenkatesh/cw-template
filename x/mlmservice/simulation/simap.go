package simulation

import (
	"fmt"
	sdk "github.com/cosmos/cosmos-sdk/types"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
)

// FindAccount find a specific address from an account list
func FindAccount(accs []simtypes.Account, address string) (simtypes.Account, bool) {
	creator, err := sdk.AccAddressFromBech32(address)
	if err != nil {
		fmt.Println("Error-18", err)
		panic(err)
	}
	return simtypes.FindAccount(accs, creator)
}
