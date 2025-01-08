import React from 'react'
import Markdown from 'markdown-to-jsx'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import 'highlight.js/styles/monokai.css' // Change the theme here
import hljs from 'highlight.js'

// Inline CodeBlock definition
export const CodeBlock: React.FC<{ language: string; children: string }> = ({
  language,
  children
}) => {
  // Apply syntax highlighting using highlight.js
  const highlightedCode = hljs.highlightAuto(children).value

  return (
    <div className="relative p-4 bg-gray-900 text-white rounded-md overflow-auto">
      <div className="absolute top-2 right-2">
        <CopyToClipboard text={children}>
          <button className="btn btn-xs bg-blue-600 text-white hover:bg-blue-500">
            Copy
          </button>
        </CopyToClipboard>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded-md">
          {language || 'plaintext'}
        </span>
      </div>
      {/* Highlighting the code with syntax highlighting */}
      <pre className="whitespace-pre-wrap break-words text-left">
        <code
          className={`language-${language || 'plaintext'}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  )
}

type ChatMessageProps = {
  message: string
  excludeCodeBlocks?: boolean // Control whether to exclude code blocks
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  excludeCodeBlocks = false
}) => {
  const filteredMessage = excludeCodeBlocks
    ? message.replace(/```[\s\S]*?```/g, '') // Remove code blocks if flag is set
    : message

  return (
    <div className="card bg-base-200 shadow-lg mb-4 p-4 text-left">
      <Markdown
        options={{
          overrides: {
            code: {
              component: ({ className, children }) => {
                const language =
                  className?.replace('language-', '') || 'plaintext'
                return <CodeBlock language={language}>{children}</CodeBlock>
              }
            }
          }
        }}
      >
        {filteredMessage}
      </Markdown>
    </div>
  )
}

export default ChatMessage
