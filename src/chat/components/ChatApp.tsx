import React, { useState } from 'react'
import ChatMessage from './ChatMessage'

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [response, setResponse] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)
      setNewMessage('')

      try {
        const res = await fetch('http://localhost:8000/chat/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: updatedMessages
          })
        })

        const data = await res.json()

        if (data.status === 'success') {
          console.log(data.ai_response)
          setResponse(data.ai_response)
        } else {
          console.error('Error in backend response:', data.error)
        }
      } catch (error) {
        console.error('Error sending message to backend:', error)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-base-100 p-4">
      <div className="flex flex-col space-y-4 overflow-auto max-h-[500px]">
        {/* Display messages */}
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {/* Display the response from the backend */}
        {response && (
          <div className="card bg-base-300 shadow-lg p-4">
            {/* Pass the AI response to ChatMessage */}
            <ChatMessage message={response} />
          </div>
        )}
      </div>

      {/* Input and Send Button */}
      <div className="mt-4 flex space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="input input-bordered w-full"
        />
        <button onClick={handleSendMessage} className="btn btn-primary px-6">
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatApp
