package keeper

import (
	"context"

	"github.com/calib/mlm-chain/x/mlmchain/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

func (k msgServer) BuyName(goCtx context.Context, msg *types.MsgBuyName) (*types.MsgBuyNameResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	whois, isFound := k.GetWhois(ctx, msg.Name)
	minPrice := sdk.Coins{sdk.NewInt64Coin("calib", 10)}
	price, _ := sdk.ParseCoinsNormalized(whois.Price)
	currentPrice, _ := sdk.ParseCoinsNormalized(msg.Price)
	owner, _ := sdk.AccAddressFromBech32(whois.Owner)
	buyer, _ := sdk.AccAddressFromBech32(msg.Creator)

	if isFound {
		if price.IsAllGT(currentPrice) {
			return nil, sdkerrors.Wrap(sdkerrors.ErrInsufficientFunds, "current price is not high enough")
		}
		k.bankKeeper.SendCoins(ctx, buyer, owner, currentPrice)
	} else {
		if minPrice.IsAllGT(currentPrice) {
			return nil, sdkerrors.Wrap(sdkerrors.ErrInsufficientFunds, "current price is less than min amount")
		}
		k.bankKeeper.SendCoinsFromAccountToModule(ctx, buyer, types.ModuleName, currentPrice)
	}
	
	newWhois := types.Whois{
		Index: msg.Name,
		Name:  msg.Name,
		Value: whois.Value,
		Price: currentPrice.String(),
		Owner: buyer.String(),
	}

	k.SetWhois(ctx, newWhois)

	return &types.MsgBuyNameResponse{}, nil
}
