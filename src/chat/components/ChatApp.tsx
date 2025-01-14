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
  const [filePath, setFilePath] = useState<string>('')
  const [conversationId, setConversationId] = useState<string | null>(
    localStorage.getItem('conversationId')
  )
  const [rightPanelContent, setRightPanelContent] = useState<string>('')

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
          setMessages((prev) => [
            ...prev,
            { text: aiResponse.trim(), sender: 'llm', codeButtons: [] }
          ])

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

  const handleCodeButtonClick = (
    index: number,
    code: string,
    language: string
  ) => {
    setRightPanelContent(code)
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
                onCodeButtonClick={handleCodeButtonClick}
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
            <SyntaxHighlighter style={materialDark} language="javascript">
              {rightPanelContent}
            </SyntaxHighlighter>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default ChatApp
