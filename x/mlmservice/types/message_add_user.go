package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgAddUser = "add_user"

var _ sdk.Msg = &MsgAddUser{}

func NewMsgAddUser(creator string, userName string, referrerId string) *MsgAddUser {
	return &MsgAddUser{
		Creator:    creator,
		UserName:   userName,
		ReferrerId: referrerId,
	}
}

func (msg *MsgAddUser) Route() string {
	return RouterKey
}

func (msg *MsgAddUser) Type() string {
	return TypeMsgAddUser
}

func (msg *MsgAddUser) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgAddUser) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgAddUser) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
