package types

import (
	"fmt"
)

// DefaultIndex is the default capability global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default Capability genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		UserDetailList: []UserDetail{},
		// this line is used by starport scaffolding # genesis/types/default
		Params: DefaultParams(),
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {
	// Check for duplicated index in userDetail
	userDetailIndexMap := make(map[string]struct{})

	for _, elem := range gs.UserDetailList {
		index := string(UserDetailKey(elem.Index))
		if _, ok := userDetailIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for userDetail")
		}
		userDetailIndexMap[index] = struct{}{}
	}
	// this line is used by starport scaffolding # genesis/types/validate

	return gs.Params.Validate()
}
