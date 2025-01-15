import React, { useState, useEffect } from 'react'

// Define the props for the Sidebar component
interface SidebarProps {
  onSelectConversation: (conversationId: string) => void // Function to handle conversation selection
}

// Sidebar component definition
const Sidebar: React.FC<SidebarProps> = ({ onSelectConversation }) => {
  // State to manage the open/closed status of the sidebar
  const [isOpen, setIsOpen] = useState(false)
  // State to hold the list of conversations
  const [conversations, setConversations] = useState<
    { conversationId: string; title: string }[]
  >([])

  // useEffect to fetch conversations when the component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Fetch conversations from the API
        const response = await fetch(
          'http://127.0.0.1:8000/chat/list-conversations/'
        )
        const data = await response.json()
        // Check if the fetch was successful and update state
        if (data.status === 'success') {
          setConversations(data.conversations)
        }
      } catch (error) {
        // Log any errors that occur during the fetch
        console.error('Error fetching conversations:', error)
      }
    }

    // Call the fetch function
    fetchConversations()
  }, []) // Empty dependency array means this runs once on mount

  return (
    <div className="relative">
      {/* Button to toggle the sidebar open/closed */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary m-4"
      >
        {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      </button>

      {/* Render the sidebar if it is open */}
      {isOpen && (
        <div className="absolute left-0 top-0 h-screen bg-base-200 w-64 shadow-md z-50">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Conversations</h2>
            <ul className="space-y-2">
              {/* Map over the conversations and create a list item for each */}
              {conversations.map((conv) => (
                <li key={conv.conversationId}>
                  <button
                    onClick={() => {
                      // Call the onSelectConversation prop with the selected conversation ID
                      onSelectConversation(conv.conversationId)
                      // Close the sidebar after selection
                      setIsOpen(false)
                    }}
                    className="w-full text-left btn btn-sm btn-outline"
                  >
                    {/* Display the conversation title or a default title if none exists */}
                    {conv.title ||
                      `Conversation ${conv.conversationId.slice(0, 8)}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar