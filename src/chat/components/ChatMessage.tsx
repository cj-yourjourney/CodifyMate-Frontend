import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ChatMessageProps {
  message: string
  sender: 'user' | 'llm'
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  const isUser = sender === 'user'

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
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className="relative group">
                  <SyntaxHighlighter
                    style={materialDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                  <button
                    onClick={() =>
                      handleCopy(String(children).replace(/\n$/, ''))
                    }
                    className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Copy
                  </button>
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

