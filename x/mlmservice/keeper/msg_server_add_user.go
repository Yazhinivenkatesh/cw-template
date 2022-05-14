package keeper

import (
	"context"

	"github.com/calibchain/mlmservice/x/mlmservice/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) AddUser(goCtx context.Context, msg *types.MsgAddUser) (*types.MsgAddUserResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	userDetail, isFound := k.GetUserDetail(ctx, msg.UserName)

	price := sdk.Coins{sdk.NewInt64Coin("token", 50)}

	userName, _ := sdk.AccAddressFromBech32(msg.Creator)
	referrerId, _ := sdk.AccAddressFromBech32(userDetail.ReferrerId)

	if isFound {
		// k.bankKeeper.SendCoins(ctx, UserName, referrerId, balance)
		k.bankKeeper.SendCoins(ctx, referrerId, userName, price)
	}

	return &types.MsgAddUserResponse{}, nil
}
