// ChatMessage.tsx
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import axios from 'axios'

interface ChatMessageProps {
  message: string
  sender: 'user' | 'llm'
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const isUser = sender === 'user'

  const [copyButtonText, setCopyButtonText] = useState<string>('Copy')

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyButtonText('Copied')
        setTimeout(() => setCopyButtonText('Copy'), 2000) // Reset button text after 2 seconds
      }
      
    )
  }

  const saveToFile = async (code: string) => {
    const filePath = prompt('Enter the file path to save:')
    if (filePath) {
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/chat/save-file/',
          {
            file_path: filePath,
            code
          }
        )
        if (response.data.status === 'success') {
          alert('File saved successfully!')
        } else {
          alert(`Error: ${response.data.message}`)
        }
      } catch (error) {
        console.error('Error saving file:', error)
        alert('An error occurred while saving the file.')
      }
    }
  }

  return (
    <div
      className={`mb-4 flex ${
        isUser ? 'justify-end' : 'justify-start'
      } items-start`}
    >
      <div
        className={`p-4 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white max-w-xs'
            : 'bg-gray-200 text-black w-full'
        }`}
      >
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              const codeContent = String(children).replace(/\n$/, '')
              return !inline && match ? (
                <div className="relative group">
                  <SyntaxHighlighter
                    style={materialDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(codeContent)}
                      className="px-2 py-1 bg-gray-700 text-white rounded text-sm hidden group-hover:block"
                    >
                      {copyButtonText}
                    </button>
                    <button
                      onClick={() => saveToFile(codeContent)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-sm hidden group-hover:block"
                    >
                      Save File
                    </button>
                  </div>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default ChatMessage
