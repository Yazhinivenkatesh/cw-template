import { combineReducers } from 'redux';
import walletReducer from '../../redux/Wallet/reducer';

const rootReducer = combineReducers({
  wallet: walletReducer,
});

export default rootReducer;