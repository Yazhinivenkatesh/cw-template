package app

import (
	wasmkeeper "github.com/CosmWasm/wasmd/x/wasm/keeper"
)

const (
	// DefaultCalibInstanceCost is initially set the same as in wasmd
	DefaultCalibInstanceCost uint64 = 60_000
	// DefaultCalibCompileCost set to a large number for testing
	DefaultCalibCompileCost uint64 = 100
)

// CalibGasRegisterConfig is defaults plus a custom compile amount
func CalibGasRegisterConfig() wasmkeeper.WasmGasRegisterConfig {
	gasConfig := wasmkeeper.DefaultGasRegisterConfig()
	gasConfig.InstanceCost = DefaultCalibInstanceCost
	gasConfig.CompileCost = DefaultCalibCompileCost

	return gasConfig
}

func NewCalibWasmGasRegister() wasmkeeper.WasmGasRegister {
	return wasmkeeper.NewWasmGasRegister(CalibGasRegisterConfig())
}
