package keeper

import (
	"github.com/calib/mlm-chain/x/mlmservice/types"
)

var _ types.QueryServer = Keeper{}
