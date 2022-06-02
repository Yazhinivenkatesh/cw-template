
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './combineReducer'

export default configureStore({
    reducer: {rootReducer}
})
