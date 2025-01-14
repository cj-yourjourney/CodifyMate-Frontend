import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ChatMessageProps {
  message: string
  sender: 'user' | 'llm'
  codeButtons: { title: string; index: number }[]
  onCodeButtonClick: (index: number) => void
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sender,
  codeButtons,
  onCodeButtonClick
}) => {
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
        {!isUser && (
          <div className="mb-2">
            {codeButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => onCodeButtonClick(button.index)}
                className="btn btn-secondary mb-2"
              >
                {button.title}
              </button>
            ))}
          </div>
        )}
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={materialDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
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
