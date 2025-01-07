import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

type ChatMessageProps = {
  message: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className="card bg-base-200 shadow-lg mb-4 p-4">
      <ReactMarkdown
        children={message}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeContent = String(children).trim()

            return !inline ? (
              <div className="p-4 bg-gray-900 text-white rounded-md overflow-auto">
                <div className="flex justify-between mb-2">
                  <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded-md">
                    {match ? match[1] : 'plaintext'}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(codeContent)}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-500"
                  >
                    Copy
                  </button>
                </div>
                <pre className="whitespace-pre-wrap break-words text-left">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      />
    </div>
  )
}

export default ChatMessage
