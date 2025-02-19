import { configureStore } from '@reduxjs/toolkit'
import promptReducer from './slices/promptSlice'
import relevantFilePathReducer from './slices/relevantFilePathSlice'

// Export individual reducers instead of combining them
export const promptReducers = {
  prompt: promptReducer,
  filePath: relevantFilePathReducer
}

const promptStore = configureStore({
  reducer: promptReducers // Use the object directly
})

export type PromptRootState = ReturnType<typeof promptStore.getState>
export type PromptAppDispatch = typeof promptStore.dispatch

export default promptStore
