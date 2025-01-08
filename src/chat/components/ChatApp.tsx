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
  const [filePath, setFilePath] = useState<string>('')
  const [showInput, setShowInput] = useState<boolean>(false)

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

  const handleGenerateFile = () => {
    setShowInput(true) // Show input field to enter file path
  }

  const handleSaveFile = async (code: string, language: string) => {
    if (filePath) {
      const response = await fetch('http://localhost:8000/chat/save_file/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file_path: filePath,
          code: code,
          language: language
        })
      })

      if (response.ok) {
        alert('File saved successfully!')
      } else {
        alert('Error saving file!')
      }
      setShowInput(false) // Hide input after save
    }
  }

  return (
    <div className="min-h-screen flex bg-base-100">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50}>
          <div className="flex flex-col p-4 space-y-4 overflow-auto h-full">
            <div className="flex flex-col space-y-4 overflow-auto">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} excludeCodeBlocks />
              ))}

              {response && (
                <div className="card bg-base-300 shadow-lg p-4">
                  <ChatMessage message={response} excludeCodeBlocks />
                </div>
              )}
            </div>

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

            <button
              onClick={handleGenerateFile}
              className="btn btn-secondary mt-4"
            >
              Generate & Save File
            </button>

            {showInput && (
              <div className="mt-4">
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="Enter file path"
                  className="input input-bordered w-full"
                />
                <button
                  onClick={() =>
                    handleSaveFile(
                      codeHistory[codeHistory.length - 1]?.code || '',
                      'txt'
                    )
                  }
                  className="btn btn-success mt-2"
                >
                  Save File
                </button>
              </div>
            )}
          </div>
        </Panel>

        <PanelResizeHandle />

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
