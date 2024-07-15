import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import fileSlice from '../api/fileSlice'

const rootReducer = combineReducers({
  files: fileSlice.reducer
})
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
export default store
