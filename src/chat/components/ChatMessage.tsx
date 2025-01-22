// ChatMessage.tsx
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/prism'

import axios from 'axios'

interface ChatMessageProps {
  message: string
  sender: 'user' | 'llm'
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const isUser = sender === 'user'

  const [copyButtonText, setCopyButtonText] = useState<string>('Copy')

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyButtonText('Copied')
      setTimeout(() => setCopyButtonText('Copy'), 2000) // Reset button text after 2 seconds
    })
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
          isUser ? 'bg-blue-500 text-white max-w-xs' : 'bg-gray-200 w-full'
        }`}
        style={
          !isUser
            ? {
                // fontSize: '1.1rem', // Adjust font size for LLM messages
                // color: '#4b5563', // Adjust text color for LLM messages
                // lineHeight: '1.6' // Adjust line height for readability
              }
            : undefined // No custom styling for user messages
        }
      >
        <ReactMarkdown
          components={{
            // Styling for headers (h1, h2, h3, etc.)
            h1: ({ node, ...props }) => (
              <h1
                className="text-3xl font-bold text-gray-950 my-4"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-2xl font-semibold text-gray-900 my-5"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-xl font-semibold text-gray-900 my-7"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                className="text-lg text-gray-800 leading-loose my-5"
                {...props}
              />
            ),
            // Styling for ordered lists
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal pl-5 text-lg space-y-2 my-5"
                {...props}
              />
            ),
            // Styling for unordered lists
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc pl-5 text-lg space-y-2 my-5"
                {...props}
              />
            ),
            // Styling for list items
            li: ({ node, ...props }) => (
              <li className="text-gray-700 text-lg my-5" {...props} />
            ),
            // Styling for blockquotes
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 pl-4 italic text-gray-950 my-4"
                {...props}
              />
            ),
            // Styling for links
            a: ({ node, ...props }) => (
              <a className="text-blue-600 hover:underline" {...props} />
            ),
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              const codeContent = String(children).replace(/\n$/, '')

              return !inline && match ? (
                <div className="relative group text-lg">
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
                // Inline code styling
                <code
                  className={`${className} bg-gray-100 text-green-600 px-2 py-1 rounded-sm text-lg`}
                  {...props}
                >
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
