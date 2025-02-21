// templates/state/slices/templateSlice.ts
import { createTemplateSliceUtil } from '../utils/createTemplateSliceUtil'
import { createTemplateAsyncThunkUtil } from '../utils/createTemplateAsyncThunkUtil'

export interface TemplateState {
  purpose: string
  functionality: string
  data: string
  design: string
  integration: string
  refinedResponse: string | null
  loading: boolean
  error: string | null
}

const initialState: TemplateState = {
  purpose: '',
  functionality: '',
  data: '',
  design: '',
  integration: '',
  refinedResponse: null,
  loading: false,
  error: null
}

export const refineTemplate = createTemplateAsyncThunkUtil<
  string,
  Omit<TemplateState, 'loading' | 'error' | 'refinedResponse'>
>('template/refineTemplate', (payload) => ({
  url: 'http://127.0.0.1:8000/prompt/refine/',
  body: payload
}))

const templateSlice = createTemplateSliceUtil(
  'template',
  initialState,
  {
    setTemplateField: (state, action) => {
      const { field, value } = action.payload
      ;(state as any)[field] = value
    },
    resetTemplate: () => initialState
  },
  refineTemplate,
  'refinedResponse'
)

export const { setTemplateField, resetTemplate } = templateSlice.actions
export default templateSlice.reducer
