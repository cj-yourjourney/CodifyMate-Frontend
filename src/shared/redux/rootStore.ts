import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { promptReducers } from '../../prompts/state/promptStore'

// Combine all reducers, including those from prompts
const rootReducer = combineReducers({
  ...promptReducers // Now this correctly spreads the individual reducers
  // chat: chatReducer,
  // codeCheck: checkCodeReducer,
})

const rootStore = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof rootStore.getState>
export type AppDispatch = typeof rootStore.dispatch

export default rootStore
