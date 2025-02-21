// chat/state/chatStore.ts
import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './slices/chatSlice'

const chatStore = configureStore({
  reducer: {
    chat: chatReducer
  }
})

export type ChatRootState = ReturnType<typeof chatStore.getState>
export type ChatAppDispatch = typeof chatStore.dispatch
export default chatStore
