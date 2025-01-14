import React, { useState, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ChatMessage from './ChatMessage'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<
    {
      text: string
      sender: string
      codeButtons: { title: string; index: number }[]
    }[]
  >([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [codeHistory, setCodeHistory] = useState<
    { language: string; code: string; title: string }[]
  >([])
  const [filePath, setFilePath] = useState<string>('')
  const [selectedCode, setSelectedCode] = useState<number | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(
    localStorage.getItem('conversationId')
  )

  useEffect(() => {
    const loadConversation = async () => {
      if (conversationId) {
        try {
          const res = await fetch(
            'http://127.0.0.1:8000/chat/load-conversation/',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ conversation_id: conversationId })
            }
          )
          const data = await res.json()
          if (data.status === 'success') {
            setMessages(
              data.messages.map((msg: any) => ({ ...msg, codeButtons: [] }))
            )
          }
        } catch (error) {
          console.error('Error loading conversation:', error)
        }
      }
    }

    loadConversation()
  }, [conversationId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const updatedMessages = [
        ...messages,
        { text: newMessage, sender: 'user', codeButtons: [] }
      ]
      setMessages(updatedMessages)
      setNewMessage('')

      try {
        const res = await fetch('http://localhost:8000/chat/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((msg) => msg.text),
            file_paths: filePath
              ? filePath.split(',').map((path) => path.trim())
              : [],
            conversation_id: conversationId
          })
        })

        const data = await res.json()
        if (data.status === 'success') {
          const aiResponse = data.ai_response
          const codeMatches = aiResponse.match(/```(\w*)\n([\s\S]*?)```/g)

          const codeButtons: { title: string; index: number }[] = []

          let cleanedResponse = aiResponse

          if (codeMatches) {
            codeMatches.forEach((codeBlock, index) => {
              const [, language, code] =
                codeBlock.match(/```(\w*)\n([\s\S]*?)```/) || []
              const isBigBlock = code.split('\n').length > 5
              const title = `Code Block ${codeHistory.length + index + 1}`
              if (isBigBlock) {
                setCodeHistory((prev) => [
                  ...prev,
                  { language: language || 'plaintext', code, title }
                ])
                codeButtons.push({ title, index: codeHistory.length + index })
                cleanedResponse = cleanedResponse.replace(codeBlock, '') // Remove the big code block
              }
            })
          }

          setMessages((prev) => [
            ...prev,
            { text: cleanedResponse.trim(), sender: 'llm', codeButtons }
          ])

          // Save conversation ID if not already saved
          if (!conversationId) {
            localStorage.setItem('conversationId', data.conversation_id)
            setConversationId(data.conversation_id)
          }
        }
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  const handleSelectCode = (index: number) => {
    setSelectedCode(index)
  }

  return (
    <div className="min-h-screen flex bg-base-100">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50}>
          <div className="flex flex-col p-4 space-y-4 overflow-auto h-full">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                sender={message.sender}
                codeButtons={message.codeButtons}
                onCodeButtonClick={handleSelectCode}
              />
            ))}

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

            <div className="mt-4">
              <input
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="Enter file paths (comma-separated)"
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle />

        <Panel defaultSize={50}>
          <div className="flex flex-col p-4 space-y-4 bg-gray-900 text-white overflow-auto h-full">
            <h2 className="text-lg font-bold">Generated Code</h2>

            {selectedCode !== null && (
              <div className="mt-4">
                <h3 className="text-sm font-bold">
                  {codeHistory[selectedCode].title}
                </h3>
                <SyntaxHighlighter
                  style={materialDark}
                  language={codeHistory[selectedCode].language}
                >
                  {codeHistory[selectedCode].code}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default ChatApp
