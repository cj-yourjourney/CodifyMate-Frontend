import { configureStore } from '@reduxjs/toolkit'
import promptReducer from './slices/promptSlice'

const promptStore = configureStore({
  reducer: {
    prompt: promptReducer
  }
})

export type PromptRootState = ReturnType<typeof promptStore.getState>
export type PromptAppDispatch = typeof promptStore.dispatch

export default promptStore
