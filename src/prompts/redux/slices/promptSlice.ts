import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface PromptState {
  purpose: string
  functionality: string
  data: string
  design: string
  integration: string
  refinedPrompt: string | null
  loading: boolean
  error: string | null
}

const initialState: PromptState = {
  purpose: '',
  functionality: '',
  data: '',
  design: '',
  integration: '',
  refinedPrompt: null,
  loading: false,
  error: null
}

// Async thunk for handling API request
export const refinePrompt = createAsyncThunk(
  'prompt/refinePrompt',
  async (
    payload: Omit<PromptState, 'loading' | 'error' | 'refinedPrompt'>,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/prompt/refine/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (data.status === 'success') {
        return data.refined_prompt
      } else {
        return rejectWithValue(data.error || 'Failed to refine the prompt.')
      }
    } catch (error) {
      return rejectWithValue('An error occurred while refining the prompt.')
    }
  }
)

const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    setPromptField: (state, action) => {
      const { field, value } = action.payload
      ;(state as any)[field] = value
    },
    resetPrompt: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(refinePrompt.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(refinePrompt.fulfilled, (state, action) => {
        state.loading = false
        state.refinedPrompt = action.payload
        console.log('fulfilled state: ', state)
      })
      .addCase(refinePrompt.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setPromptField, resetPrompt } = promptSlice.actions
export default promptSlice.reducer
