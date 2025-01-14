import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ChatMessageProps {
  message: string
  sender: 'user' | 'llm'
  codeButtons: { title: string; index: number }[]
  onCodeButtonClick: (index: number, code: string, language: string) => void
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sender,
  codeButtons,
  onCodeButtonClick
}) => {
  const isUser = sender === 'user'

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => alert('Code copied to clipboard!'),
      (err) => console.error('Failed to copy text: ', err)
    )
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
        {!isUser && (
          <div className="mb-2">
            {codeButtons.map((button, index) => (
              <button
                key={index}
                onClick={() =>
                  onCodeButtonClick(
                    button.index,
                    codeButtons[button.index].code,
                    codeButtons[button.index].language
                  )
                }
                className="btn btn-secondary mb-2 mr-2"
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
                      Copy
                    </button>
                    <button
                      onClick={() =>
                        onCodeButtonClick(
                          -1,
                          codeContent,
                          match[1] || 'plaintext'
                        )
                      }
                      className="px-2 py-1 bg-blue-600 text-white rounded text-sm hidden group-hover:block"
                    >
                      Display at Right
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
