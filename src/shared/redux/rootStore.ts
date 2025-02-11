import { configureStore } from '@reduxjs/toolkit'
import promptReducer from '../../prompts/redux/slices/promptSlice'
// Import other reducers when they are available
// import chatReducer from './chat/redux/slices/chatSlice'
// import checkCodeReducer from './checkCode/redux/slices/checkCodeSlice'

const rootStore = configureStore({
  reducer: {
    prompt: promptReducer
    // chat: chatReducer,
    // codeCheck: checkCodeReducer,
  }
})

export type RootState = ReturnType<typeof rootStore.getState>
export type AppDispatch = typeof rootStore.dispatch

export default rootStore
