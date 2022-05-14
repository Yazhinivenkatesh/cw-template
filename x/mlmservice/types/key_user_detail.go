package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// UserDetailKeyPrefix is the prefix to retrieve all UserDetail
	UserDetailKeyPrefix = "UserDetail/value/"
)

// UserDetailKey returns the store key to retrieve a UserDetail from the index fields
func UserDetailKey(
	index string,
) []byte {
	var key []byte

	indexBytes := []byte(index)
	key = append(key, indexBytes...)
	key = append(key, []byte("/")...)

	return key
}
