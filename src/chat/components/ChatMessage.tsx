import React from 'react'

type ChatMessageProps = {
  message: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className="card bg-base-200 shadow-lg mb-4 p-4">
      <p className="text-lg">{message}</p>
    </div>
  )
}

export default ChatMessage
