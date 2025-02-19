import { createSliceUtil } from '../utils/createSliceUtil'
import { createAsyncThunkUtil } from '../utils/createAsyncThunkUtil'

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

export const refinePrompt = createAsyncThunkUtil(
  'prompt/refinePrompt',
  (payload: Omit<PromptState, 'loading' | 'error' | 'refinedPrompt'>) => ({
    url: 'http://127.0.0.1:8000/prompt/refine/',
    body: payload
  })
)

const promptSlice = createSliceUtil(
  'prompt',
  initialState,
  {
    setPromptField: (state, action) => {
      const { field, value } = action.payload
      ;(state as any)[field] = value
    },
    resetPrompt: () => initialState
  },
  refinePrompt,
  'refinedPrompt'
)

export const { setPromptField, resetPrompt } = promptSlice.actions
export default promptSlice.reducer
