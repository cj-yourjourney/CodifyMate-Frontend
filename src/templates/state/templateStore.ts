// templates/state/templateStore.ts
import { configureStore } from '@reduxjs/toolkit'
import templateReducer from './slices/templateSlice'

export const templateReducers = {
  template: templateReducer
}

const templateStore = configureStore({
  reducer: templateReducers // Using the object directly
})

export type TemplateRootState = ReturnType<typeof templateStore.getState>
export type TemplateAppDispatch = typeof templateStore.dispatch

export default templateStore
