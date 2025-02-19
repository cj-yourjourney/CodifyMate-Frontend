import { createSliceUtil } from '../utils/createSliceUtil'
import { createAsyncThunkUtil } from '../utils/createAsyncThunkUtil'

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

export const fetchRelevantFilePaths = createAsyncThunkUtil(
  'relevantFilePath/fetch',
  ({
    featureRequest,
    conversationId
  }: {
    featureRequest: string
    conversationId: string
  }) => ({
    url: 'http://127.0.0.1:8000/prompt/get-file-paths/',
    body: { feature_request: featureRequest, conversation_id: conversationId }
  })
)

const relevantFilePathSlice = createSliceUtil(
  'relevantFilePath',
  initialState,
  {
    setFeatureRequest: (state, action) => {
      state.featureRequest = action.payload
    }
  },
  fetchRelevantFilePaths,
  'responseMessage'
)

export const { setFeatureRequest } = relevantFilePathSlice.actions
export default relevantFilePathSlice.reducer
