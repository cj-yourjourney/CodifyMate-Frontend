import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface RelevantFilePathState {
  featureRequest: string
  responseMessage: string | null
  loading: boolean
  error: string | null
}

const initialState: RelevantFilePathState = {
  featureRequest: '',
  responseMessage: null,
  loading: false,
  error: null
}

// Async thunk for handling API request
export const fetchRelevantFilePaths = createAsyncThunk(
  'relevantFilePath/fetch',
  async (
    {
      featureRequest,
      conversationId
    }: { featureRequest: string; conversationId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/prompt/get-file-paths/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            feature_request: featureRequest,
            conversation_id: conversationId
          })
        }
      )

      const data = await response.json()
      if (data.status === 'success') {
        return data.response
      } else {
        return rejectWithValue(data.message || 'An error occurred.')
      }
    } catch (error) {
      return rejectWithValue('An error occurred while fetching file paths.')
    }
  }
)

const relevantFilePathSlice = createSlice({
  name: 'relevantFilePath',
  initialState,
  reducers: {
    setFeatureRequest: (state, action) => {
      state.featureRequest = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelevantFilePaths.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRelevantFilePaths.fulfilled, (state, action) => {
        state.loading = false
        state.responseMessage = action.payload
      })
      .addCase(fetchRelevantFilePaths.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setFeatureRequest } = relevantFilePathSlice.actions
export default relevantFilePathSlice.reducer
