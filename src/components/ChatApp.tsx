// src/components/ChatApp.tsx
import React, { useState } from 'react'
import ChatMessage from './ChatMessage'

const ChatApp: React.FC = () => {
  // State for messages and new message input
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState<string>('')

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  // Handle send button click
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage])
      setNewMessage('')
    }
  }

  return (
    <div>
      <div>
        {/* Display messages */}
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>

      {/* Input field and send button */}
      <input
        type="text"
        value={newMessage}
        onChange={handleInputChange}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  )
}

export default ChatApp
