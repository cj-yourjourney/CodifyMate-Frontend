// src/components/ChatMessage.tsx
import React from 'react'

type ChatMessageProps = {
  message: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div>
      <p>{message}</p>
    </div>
  )
}

export default ChatMessage
