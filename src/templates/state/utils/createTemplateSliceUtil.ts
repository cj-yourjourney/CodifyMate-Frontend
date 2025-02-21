// templates/state/utils/createTemplateSliceUtil.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BaseState {
  loading: boolean
  error: string | null
}

export const createTemplateSliceUtil = <T extends BaseState>(
  name: string,
  initialState: T,
  reducers: any,
  asyncThunk: any,
  responseField: keyof T
) => {
  return createSlice({
    name,
    initialState,
    reducers,
    extraReducers: (builder) => {
      builder
        .addCase(asyncThunk.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(asyncThunk.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false
          ;(state[responseField] as any) = action.payload
        })
        .addCase(asyncThunk.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false
          state.error = action.payload
        })
    }
  })
}
