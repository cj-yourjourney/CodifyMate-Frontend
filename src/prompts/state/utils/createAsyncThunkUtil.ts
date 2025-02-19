import { createAsyncThunk } from '@reduxjs/toolkit'

interface AsyncThunkPayload {
  url: string
  method?: string
  body?: Record<string, any>
}

export const createAsyncThunkUtil = <Returned, ThunkArg>(
  type: string,
  requestHandler: (arg: ThunkArg) => AsyncThunkPayload
) => {
  return createAsyncThunk<Returned, ThunkArg>(
    type,
    async (arg, { rejectWithValue }) => {
      try {
        const { url, method = 'POST', body } = requestHandler(arg)
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        const data = await response.json()
        if (data.status === 'success') {
          return data.response || data.refined_prompt
        } else {
          return rejectWithValue(data.message || 'An error occurred.')
        }
      } catch (error) {
        return rejectWithValue('An error occurred while making the request.')
      }
    }
  )
}
