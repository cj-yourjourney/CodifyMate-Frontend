// chat/state/slices/chatSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Message {
  text: string
  sender: string
  codeButtons: { title: string; index: number }[]
}

export interface ChatState {
  messages: Message[]
  newMessage: string
  filePath: string
  conversationId: string | null
  summary: string | null
  projectFolderPath: string | null
  loading: boolean
  error: string | null
}

const initialState: ChatState = {
  messages: [],
  newMessage: '',
  filePath: '',
  conversationId: localStorage.getItem('conversationId') || null,
  summary: null,
  projectFolderPath: null,
  loading: false,
  error: null
}

// Async thunk for loading a conversation
export const loadConversation = createAsyncThunk(
  'chat/loadConversation',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/chat/load-conversation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId })
      })
      const data = await res.json()
      if (data.status === 'success') {
        return data
      }
      return rejectWithValue(data.message)
    } catch (error: any) {
      return rejectWithValue(error.toString())
    }
  }
)

// Async thunk for sending a message
export const sendMessageAsync = createAsyncThunk(
  'chat/sendMessage',
  async (
    {
      conversationId,
      messages,
      filePath
    }: { conversationId: string | null; messages: string[]; filePath: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          file_paths: filePath
            ? filePath.split(',').map((path: string) => path.trim())
            : [],
          conversation_id: conversationId
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        return data
      }
      return rejectWithValue(data.message)
    } catch (error: any) {
      return rejectWithValue(error.toString())
    }
  }
)

// Async thunk for starting a new conversation
export const startNewConversationAsync = createAsyncThunk(
  'chat/startNewConversation',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        'http://127.0.0.1:8000/chat/start-conversation/',
        {
          method: 'POST'
        }
      )
      const data = await res.json()
      if (data.status === 'success') {
        return data
      }
      return rejectWithValue(data.message)
    } catch (error: any) {
      return rejectWithValue(error.toString())
    }
  }
)

// Async thunk for analyzing a project
export const analyzeProjectAsync = createAsyncThunk(
  'chat/analyzeProject',
  async (
    {
      conversationId,
      userQuestion
    }: { conversationId: string; userQuestion: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/chat/analyze-project/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          user_question: userQuestion
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        return data.response
      }
      return rejectWithValue(data.message)
    } catch (error: any) {
      return rejectWithValue(error.toString())
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setNewMessage(state, action: PayloadAction<string>) {
      state.newMessage = action.payload
    },
    setFilePath(state, action: PayloadAction<string>) {
      state.filePath = action.payload
    },
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        text: action.payload,
        sender: 'user',
        codeButtons: []
      })
    },
    addLLMMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        text: action.payload,
        sender: 'llm',
        codeButtons: []
      })
    },
    setConversationId(state, action: PayloadAction<string>) {
      state.conversationId = action.payload
      localStorage.setItem('conversationId', action.payload)
    },
    clearMessages(state) {
      state.messages = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle loadConversation
      .addCase(loadConversation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadConversation.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload as any
        state.messages = data.messages.map(
          (msg: { text: string; sender: string }) => ({
            ...msg,
            codeButtons: []
          })
        )
        state.summary = data.summary
        state.projectFolderPath = data.project_folder_path
      })
      .addCase(loadConversation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Handle sendMessageAsync
      .addCase(sendMessageAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload as any
        state.messages.push({
          text: data.ai_response.trim(),
          sender: 'llm',
          codeButtons: []
        })
        if (!state.conversationId && data.conversation_id) {
          state.conversationId = data.conversation_id
          localStorage.setItem('conversationId', data.conversation_id)
        }
      })
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Handle startNewConversationAsync
      .addCase(startNewConversationAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startNewConversationAsync.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload as any
        state.conversationId = data.conversation_id
        localStorage.setItem('conversationId', data.conversation_id)
        state.messages = []
      })
      .addCase(startNewConversationAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Handle analyzeProjectAsync (you can choose to store the result or handle it separately)
      .addCase(analyzeProjectAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(analyzeProjectAsync.fulfilled, (state) => {
        state.loading = false
        // For now, the analysis result isn’t stored in the state.
      })
      .addCase(analyzeProjectAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {
  setNewMessage,
  setFilePath,
  addUserMessage,
  addLLMMessage,
  setConversationId,
  clearMessages
} = chatSlice.actions

export default chatSlice.reducer
