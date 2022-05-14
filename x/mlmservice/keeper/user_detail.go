package keeper

import (
	"github.com/calibchain/mlmservice/x/mlmservice/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetUserDetail set a specific userDetail in the store from its index
func (k Keeper) SetUserDetail(ctx sdk.Context, userDetail types.UserDetail) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.UserDetailKeyPrefix))
	b := k.cdc.MustMarshal(&userDetail)
	store.Set(types.UserDetailKey(
		userDetail.Index,
	), b)
}

// GetUserDetail returns a userDetail from its index
func (k Keeper) GetUserDetail(
	ctx sdk.Context,
	index string,

) (val types.UserDetail, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.UserDetailKeyPrefix))

	b := store.Get(types.UserDetailKey(
		index,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveUserDetail removes a userDetail from the store
func (k Keeper) RemoveUserDetail(
	ctx sdk.Context,
	index string,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.UserDetailKeyPrefix))
	store.Delete(types.UserDetailKey(
		index,
	))
}

// GetAllUserDetail returns all userDetail
func (k Keeper) GetAllUserDetail(ctx sdk.Context) (list []types.UserDetail) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.UserDetailKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.UserDetail
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
