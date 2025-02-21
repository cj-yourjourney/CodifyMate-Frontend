// shared/components/MarkdownRenderer.tsx
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import axios from 'axios'

interface MarkdownRendererProps {
  content: string
}

const CodeBlock: React.FC<any> = ({
  inline,
  className,
  children,
  ...props
}) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy')
  const codeContent = String(children).replace(/\n$/, '')
  const match = /language-(\w+)/.exec(className || '')

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyButtonText('Copied')
      setTimeout(() => setCopyButtonText('Copy'), 2000)
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

  if (!inline && match) {
    return (
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
    )
  } else {
    return (
      <code
        className={`${className} bg-gray-100 text-green-600 px-2 py-1 rounded-sm text-lg`}
        {...props}
      >
        {children}
      </code>
    )
  }
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }: any) => (
          <h1 className="text-3xl font-bold text-gray-950 my-4" {...props} />
        ),
        h2: ({ node, ...props }: any) => (
          <h2
            className="text-2xl font-semibold text-gray-900 my-5"
            {...props}
          />
        ),
        h3: ({ node, ...props }: any) => (
          <h3 className="text-xl font-semibold text-gray-900 my-7" {...props} />
        ),
        p: ({ node, ...props }: any) => (
          <p className="text-lg text-gray-800 leading-loose my-5" {...props} />
        ),
        ol: ({ node, ...props }: any) => (
          <ol className="list-decimal pl-5 text-lg space-y-2 my-5" {...props} />
        ),
        ul: ({ node, ...props }: any) => (
          <ul className="list-disc pl-5 text-lg space-y-2 my-5" {...props} />
        ),
        li: ({ node, ...props }: any) => (
          <li className="text-gray-700 text-lg my-5" {...props} />
        ),
        blockquote: ({ node, ...props }: any) => (
          <blockquote
            className="border-l-4 pl-4 italic text-gray-950 my-4"
            {...props}
          />
        ),
        a: ({ node, ...props }: any) => (
          <a className="text-blue-600 hover:underline" {...props} />
        ),
        code: CodeBlock
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
