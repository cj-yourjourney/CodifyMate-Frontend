import React, {
  useState,
  useEffect,
  useDeferredValue,
  useCallback,
  memo
} from 'react'
import ChatMessage from './ChatMessage'
import Sidebar from './Sidebar'
import StructuredPromptModal from '../../prompts/components/StructuredPromptModal'
import CheckCodeModal from '../../checkCode/CheckCodeModal'
import UserQuestionModal from './UserQuestionModal'
import RelevantFilePathModal from '../../prompts/components/RelevantFilePathModal'

// Memoized component to render the list of chat messages.
// It only re-renders when the messages prop actually changes.
const ChatMessagesList = memo(
  ({
    messages
  }: {
    messages: {
      text: string
      sender: string
      codeButtons: { title: string; index: number }[]
    }[]
  }) => {
    return (
      <>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            sender={message.sender}
            codeButtons={message.codeButtons}
            onCodeButtonClick={() => {}}
          />
        ))}
      </>
    )
  }
)

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<
    {
      text: string
      sender: string
      codeButtons: { title: string; index: number }[]
    }[]
  >([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [filePath, setFilePath] = useState<string>('')
  const [conversationId, setConversationId] = useState<string | null>(
    localStorage.getItem('conversationId')
  )

  const [isUserQuestionModalOpen, setIsUserQuestionModalOpen] = useState(false)
  const [userQuestion, setUserQuestion] = useState('')

  const [isRelevantFilePathModalOpen, setIsRelevantFilePathModalOpen] =
    useState(false)

  const [summary, setSummary] = useState<string | null>(null)
  const [projectFolderPath, setProjectFolderPath] = useState<string | null>(
    null
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const [isCheckCodeModalOpen, setIsCheckCodeModalOpen] = useState(false)

  // Use React's useDeferredValue to defer updating the messages list.
  // This means that while the user types a new message, the heavy messages list
  // (which may have 30+ messages) isn’t updated immediately, eliminating the lag.
  const deferredMessages = useDeferredValue(messages)

  useEffect(() => {
    const loadConversation = async () => {
      if (conversationId) {
        try {
          const res = await fetch(
            'http://127.0.0.1:8000/chat/load-conversation/',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ conversation_id: conversationId })
            }
          )
          const data = await res.json()
          if (data.status === 'success') {
            setMessages(
              data.messages.map((msg: { text: string; sender: string }) => ({
                ...msg,
                codeButtons: []
              }))
            )
          }
          setSummary(data.summary)
          setProjectFolderPath(data.project_folder_path)
        } catch (error) {
          console.error('Error loading conversation:', error)
        }
      }
    }

    loadConversation()
  }, [conversationId])
  console.log('summary: ', summary)
  console.log('path: ', projectFolderPath)

  const handleSelectConversation = async (id: string) => {
    setConversationId(id)
    localStorage.setItem('conversationId', id)

    try {
      const res = await fetch('http://127.0.0.1:8000/chat/load-conversation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: id })
      })

      const data = await res.json()
      if (data.status === 'success') {
        setMessages(
          data.messages.map((msg: { text: string; sender: string }) => ({
            ...msg,
            codeButtons: []
          }))
        )
      }
      setSummary(data.summary)
      setProjectFolderPath(data.project_folder_path)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  // useCallback to memoize the input change handler (optional optimization)
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewMessage(e.target.value)
    },
    []
  )

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const updatedMessages = [
        ...messages,
        { text: newMessage, sender: 'user', codeButtons: [] }
      ]
      setMessages(updatedMessages)
      setNewMessage('')
      setFilePath('')

      // Reset the height of the textarea
      const chatInput = document.getElementById(
        'chatInput'
      ) as HTMLTextAreaElement
      if (chatInput) {
        chatInput.style.height = 'auto'
      }

      try {
        const res = await fetch('http://127.0.0.1:8000/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((msg) => msg.text),
            file_paths: filePath
              ? filePath.split(',').map((path) => path.trim())
              : [],
            conversation_id: conversationId
          })
        })

        const data = await res.json()
        if (data.status === 'success') {
          const aiResponse = data.ai_response
          setMessages((prev) => [
            ...prev,
            { text: aiResponse.trim(), sender: 'llm', codeButtons: [] }
          ])

          if (!conversationId) {
            localStorage.setItem('conversationId', data.conversation_id)
            setConversationId(data.conversation_id)
          }
        }
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  const handleStartNewConversation = async () => {
    try {
      const res = await fetch(
        'http://127.0.0.1:8000/chat/start-conversation/',
        {
          method: 'POST'
        }
      )
      const data = await res.json()
      if (data.status === 'success') {
        setConversationId(data.conversation_id)
        localStorage.setItem('conversationId', data.conversation_id)
        setMessages([])
      }
    } catch (error) {
      console.error('Error starting new conversation:', error)
    }
  }

  const showSettings = () => {
    return (
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
    )
  }

  // Function to handle API call to analyze project
  const handleAnalyzeProject = async (question: string): Promise<string> => {
    if (!conversationId) return 'No active conversation. Start one first.'

    try {
      const res = await fetch('http://127.0.0.1:8000/chat/analyze-project/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          user_question: question
        })
      })

      const data = await res.json()
      console.log(data)
      return data.status === 'success'
        ? data.response
        : `Error: ${data.message}`
    } catch (error) {
      console.error('Error analyzing project:', error)
      return 'Error analyzing project.'
    }
  }

  return (
    <div className="min-h-screen flex bg-base-100">
      <Sidebar onSelectConversation={handleSelectConversation} />

      <div className="flex flex-col p-4 space-y-4 overflow-auto h-full w-full">
        {/* Render memoized & deferred messages list */}
        <ChatMessagesList messages={deferredMessages} />

        <div className="bg-base-200 p-4 rounded-lg shadow-md flex flex-col">
          {/* Input Field */}
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
            className="textarea w-full resize-none pb-12 bg-base-200 border-none focus:ring-0 focus:outline-none"
            rows={2}
            style={{ overflow: 'hidden' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = `${target.scrollHeight}px`
            }}
            id="chatInput"
          />

          {/* Button Container */}
          <div className="flex justify-between mt-2">
            {/* Left-side Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={toggleModal}
                className="btn btn-outline rounded-lg"
              >
                Template
              </button>
              <button
                onClick={() => setIsRelevantFilePathModalOpen(true)}
                className="btn btn-outline rounded-lg"
              >
                Paths
              </button>
            </div>

            {/* Right-side Buttons */}
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
              <button
                onClick={handleStartNewConversation}
                className="btn btn-outline rounded-lg"
              >
                New Chat
              </button>
            </div>
          </div>
        </div>

        {/* Structured Prompt Modal */}
        {isModalOpen && (
          <StructuredPromptModal isOpen={isModalOpen} onClose={toggleModal} />
        )}

        <div className="mt-4">
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            placeholder="Enter file paths (comma-separated)"
            className="input input-bordered w-full"
          />
        </div>

        {/* User Question Modal */}
        {isUserQuestionModalOpen && (
          <UserQuestionModal
            isOpen={isUserQuestionModalOpen}
            onClose={() => setIsUserQuestionModalOpen(false)}
            onSubmit={async (question) => {
              return await handleAnalyzeProject(question)
            }}
          />
        )}

        {/* Render settings only if available */}
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

        <CheckCodeModal
          isOpen={isCheckCodeModalOpen}
          onClose={() => setIsCheckCodeModalOpen(false)}
        />

        {/* Relevant File Path Modal */}
        {isRelevantFilePathModalOpen && (
          <RelevantFilePathModal
            isOpen={isRelevantFilePathModalOpen}
            onClose={() => setIsRelevantFilePathModalOpen(false)}
            conversationId={conversationId}
          />
        )}
      </div>
    </div>
  )
}

export default ChatApp
