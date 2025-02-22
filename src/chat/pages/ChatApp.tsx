// chat/components/ChatApp.tsx
import React, { useEffect, useDeferredValue, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../shared/redux/rootStore'
import StructuredPromptModal from '../../prompts/components/StructuredPromptModal'
import CheckCodeModal from '../../checkCode/CheckCodeModal'
import UserQuestionModal from '../components/UserQuestionModal'
import RelevantFilePathModal from '../../prompts/components/RelevantFilePathModal'
import {
  setNewMessage,
  setFilePath,
  addUserMessage,
  loadConversation,
  sendMessageAsync,
  startNewConversationAsync,
  analyzeProjectAsync
} from '../state/slices/chatSlice'
import ChatMessagesList from '../components/ChatMessagesList'

import TemplatePanel from '../../templates/components/TemplatePanel'

const ChatApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    messages,
    newMessage,
    filePath,
    conversationId,
    summary,
    projectFolderPath,
    loading,
    error
  } = useSelector((state: RootState) => state.chat)
  const deferredMessages = useDeferredValue(messages)

  // Load conversation on mount if conversationId exists
  useEffect(() => {
    if (conversationId) {
      dispatch(loadConversation(conversationId))
    }
  }, [conversationId, dispatch])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(setNewMessage(e.target.value))
    },
    [dispatch]
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add the user's message to the state
      dispatch(addUserMessage(newMessage))
      // Clear input and filePath
      dispatch(setNewMessage(''))
      dispatch(setFilePath(''))

      // Reset the textarea height if needed
      const chatInput = document.getElementById(
        'chatInput'
      ) as HTMLTextAreaElement
      if (chatInput) {
        chatInput.style.height = 'auto'
      }

      // Collect current messages text and dispatch send message thunk
      const allMessages = [...messages.map((msg) => msg.text), newMessage]
      dispatch(
        sendMessageAsync({
          conversationId,
          messages: allMessages,
          filePath
        })
      )
    }
  }

  const handleStartNewConversation = () => {
    dispatch(startNewConversationAsync())
  }

  const handleAnalyzeProject = async (question: string): Promise<string> => {
    if (!conversationId) return 'No active conversation. Start one first.'

    try {
      const resultAction = await dispatch(
        analyzeProjectAsync({ conversationId, userQuestion: question })
      )
      if (analyzeProjectAsync.fulfilled.match(resultAction)) {
        return resultAction.payload as string
      } else {
        return `Error: ${resultAction.payload}`
      }
    } catch (error) {
      return 'Error analyzing project.'
    }
  }

  // Local state for modal visibility (can be kept local)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isCheckCodeModalOpen, setIsCheckCodeModalOpen] = React.useState(false)
  const [isUserQuestionModalOpen, setIsUserQuestionModalOpen] =
    React.useState(false)
  const [isRelevantFilePathModalOpen, setIsRelevantFilePathModalOpen] =
    React.useState(false)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className="min-h-screen flex bg-base-100">
      {/* Main Chat Area - 70% */}
      <div
        className="w-full md:w-[70%] flex flex-col p-4 space-y-4 overflow-y-auto h-screen" // <-- Changed: added "overflow-y-auto h-screen"
      >
        <ChatMessagesList messages={deferredMessages} />

        <div className="bg-base-200 p-4 rounded-lg shadow-md flex flex-col">
          <textarea
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type a message"
            className="textarea w-full resize-none pb-12 bg-base-200 text-lg placeholder:text-lg border-none focus:ring-0 focus:outline-none"
            rows={2}
            style={{ overflow: 'hidden' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = `${target.scrollHeight}px`
            }}
            id="chatInput"
          />

          <div className="flex justify-between mt-2">
            <div className="flex space-x-2">
              {/* <button
                onClick={toggleModal}
                className="btn btn-outline rounded-lg"
              >
                Template
              </button> */}
              <button
                onClick={() => setIsRelevantFilePathModalOpen(true)}
                className="btn btn-outline rounded-lg"
              >
                Paths
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSendMessage}
                className="btn btn-primary rounded-lg"
              >
                Send
              </button>
              <button
                onClick={() => setIsCheckCodeModalOpen(true)}
                className="btn btn-outline rounded-lg"
              >
                Check
              </button>
              <button
                onClick={() => setIsUserQuestionModalOpen(true)}
                className="btn btn-outline rounded-lg"
              >
                Analyze
              </button>
              {/* <button
                onClick={handleStartNewConversation}
                className="btn btn-outline rounded-lg"
              >
                New Chat
              </button> */}
            </div>
          </div>
        </div>

        {/* Conversation Settings */}
        {summary && projectFolderPath && (
          <div className="mt-4 p-4 border rounded-md bg-gray-100">
            <h3 className="text-xl font-semibold">Conversation Settings</h3>
            <p>
              <strong>Summary:</strong> {summary || 'No summary available'}
            </p>
            <p>
              <strong>Project Folder Path:</strong>{' '}
              {projectFolderPath || 'No path available'}
            </p>
          </div>
        )}

        {/* Display global loading/error states */}
        {loading && (
          <span className="loading loading-dots loading-sm">Loading...</span>
        )}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <CheckCodeModal
          isOpen={isCheckCodeModalOpen}
          onClose={() => setIsCheckCodeModalOpen(false)}
        />

        {isModalOpen && (
          <StructuredPromptModal isOpen={isModalOpen} onClose={toggleModal} />
        )}

        <UserQuestionModal
          isOpen={isUserQuestionModalOpen}
          onClose={() => setIsUserQuestionModalOpen(false)}
          onSubmit={handleAnalyzeProject}
        />

        {isRelevantFilePathModalOpen && (
          <RelevantFilePathModal
            isOpen={isRelevantFilePathModalOpen}
            onClose={() => setIsRelevantFilePathModalOpen(false)}
            conversationId={conversationId || ''} // conversationId from chat slice
          />
        )}
      </div>

      {/* Template Panel - 30% */}
      <div className="hidden sm:block md:w-[30%] border-l bg-gray-200 w-full overflow-y-auto h-screen">
        <TemplatePanel />
      </div>
    </div>
  )
}

export default ChatApp
