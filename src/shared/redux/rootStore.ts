// shared/redux/rootStore.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { promptReducers } from '../../prompts/state/promptStore'
import chatReducer from '../../chat/state/slices/chatSlice'

// Combine all reducers, including chat
const rootReducer = combineReducers({
  ...promptReducers,
  chat: chatReducer
  // codeCheck: checkCodeReducer,
})

const rootStore = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof rootStore.getState>
export type AppDispatch = typeof rootStore.dispatch

export default rootStore
