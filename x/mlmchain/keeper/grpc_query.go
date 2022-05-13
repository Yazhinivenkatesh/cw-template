package keeper

import (
	"github.com/calib/mlm-chain/x/mlmchain/types"
)

var _ types.QueryServer = Keeper{}
