// chat/components/ChatMessagesList.tsx
import React, { memo } from 'react'
import ChatMessage from './ChatMessage'

export interface ChatMessageItem {
  text: string
  sender: string
  codeButtons: { title: string; index: number }[]
}

interface ChatMessagesListProps {
  messages: ChatMessageItem[]
}

const ChatMessagesList: React.FC<ChatMessagesListProps> = memo(
  ({ messages }) => {
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

export default ChatMessagesList
