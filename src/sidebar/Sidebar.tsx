// Sidebar.tsx
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  setConversationId,
  loadConversation,
  startNewConversationAsync
} from '../chat/state/slices/chatSlice'

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [conversations, setConversations] = useState<
    { conversationId: string; title: string }[]
  >([])
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/chat/list-conversations/'
        )
        const data = await response.json()
        if (data.status === 'success') {
          setConversations(data.conversations)
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      }
    }

    fetchConversations()
  }, [])

  const handleConversationClick = (conversationId: string) => {
    dispatch(setConversationId(conversationId))
    dispatch(loadConversation(conversationId))
    setIsOpen(false) // Close sidebar when conversation is clicked
  }

  const handleNewChat = () => {
    dispatch(startNewConversationAsync())
    setIsOpen(false) // Close sidebar after starting a new chat
  }

  return (
    <div className="relative">
      {/* When sidebar is closed, show a button to open it */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-xs btn-outline btn-info"
        >
          Sidebar
        </button>
      )}

      {isOpen && (
        <div className="absolute left-0 top-0 h-screen bg-base-200 w-64 shadow-md z-50">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Conversations</h2>
            <ul className="space-y-2">
              {conversations.map((conv) => (
                <li key={conv.conversationId}>
                  <button
                    onClick={() => handleConversationClick(conv.conversationId)}
                    className="w-full text-left btn btn-sm btn-outline"
                  >
                    {conv.title ||
                      `Conversation ${conv.conversationId.slice(0, 8)}`}
                  </button>
                </li>
              ))}
            </ul>
            {/* New Chat button */}
            <button
              onClick={handleNewChat}
              className="w-full text-left btn btn-sm btn-primary mt-4"
            >
              New Chat
            </button>
            {/* Close Sidebar button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-left btn btn-sm btn-outline mt-2"
            >
              Close Sidebar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
