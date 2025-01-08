import React, { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ChatMessage, { CodeBlock } from './ChatMessage'

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [response, setResponse] = useState<string | null>(null)
  const [codeHistory, setCodeHistory] = useState<
    { language: string; code: string }[]
  >([])

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
          setResponse(data.ai_response)

          // Extract code content from response using regex
          const codeMatch = data.ai_response.match(/```(\w*)\n([\s\S]*?)```/)
          if (codeMatch) {
            const [, language, code] = codeMatch
            setCodeHistory((prev) => [
              ...prev,
              { language: language || 'plaintext', code }
            ])
          }
        } else {
          console.error('Error in backend response:', data.error)
        }
      } catch (error) {
        console.error('Error sending message to backend:', error)
      }
    }
  }

  return (
    <div className="min-h-screen flex bg-base-100">
      {/* Resizable Panel Group */}
      <PanelGroup direction="horizontal">
        {/* Left Panel: Chat */}
        <Panel defaultSize={50}>
          <div className="flex flex-col p-4 space-y-4 overflow-auto h-full">
            <div className="flex flex-col space-y-4 overflow-auto">
              {/* Display chat messages (exclude code blocks) */}
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} excludeCodeBlocks />
              ))}

              {/* Display AI response (exclude code blocks) */}
              {response && (
                <div className="card bg-base-300 shadow-lg p-4">
                  <ChatMessage message={response} excludeCodeBlocks />
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="mt-4 flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type a message"
                className="input input-bordered w-full"
              />
              <button
                onClick={handleSendMessage}
                className="btn btn-primary px-6"
              >
                Send
              </button>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle />

        {/* Right Panel: Code Display */}
        <Panel defaultSize={50}>
          <div className="flex flex-col p-4 space-y-4 bg-gray-900 text-white overflow-auto h-full">
            <h2 className="text-lg font-bold">Generated Code</h2>
            {codeHistory.length > 0 ? (
              codeHistory.map((item, index) => (
                <CodeBlock key={index} language={item.language}>
                  {item.code}
                </CodeBlock>
              ))
            ) : (
              <p>No code generated yet.</p>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default ChatApp
