import React, { useState } from 'react'
import ChatMessage from './ChatMessage'

const ChatApp: React.FC = () => {
  // State for messages, new message input, and response from the backend
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [response, setResponse] = useState<string | null>(null) // State to store the backend response

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  // Handle send button click
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // Update the frontend with the new message
      const updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)
      setNewMessage('')

      // Send the message to the backend
      try {
        const res = await fetch('http://localhost:8000/chat/', {
          // Replace with your backend URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: updatedMessages // Send all the messages so far
          })
        })

        const data = await res.json()

        // Handle backend response and display the response from Ollama
        if (data.status === 'success') {
          setResponse(data.ollama_response) // Display the model's response
        } else {
          console.error('Error in backend response:', data.error)
        }
      } catch (error) {
        console.error('Error sending message to backend:', error)
      }
    }
  }

  return (
    <div>
      <div>
        {/* Display messages */}
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {/* Display the response from the backend (Ollama's response) */}
        {response && <div className="response">{response}</div>}
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
