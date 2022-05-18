package types

import (
	"fmt"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgBuyName = "buy_name"

var _ sdk.Msg = &MsgBuyName{}

func NewMsgBuyName(creator string, name string, price string) *MsgBuyName {
	return &MsgBuyName{
		Creator: creator,
		Name:    name,
		Price:   price,
	}
}

func (msg *MsgBuyName) Route() string {
	return RouterKey
}

func (msg *MsgBuyName) Type() string {
	return TypeMsgBuyName
}

func (msg *MsgBuyName) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		fmt.Println("Error-16", err)
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgBuyName) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgBuyName) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
