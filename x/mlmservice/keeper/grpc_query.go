package keeper

import (
	"github.com/calibchain/mlmservice/x/mlmservice/types"
)

var _ types.QueryServer = Keeper{}
