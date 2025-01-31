import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CheckCodeModalProps {
  isOpen: boolean
  onClose: () => void
}

const CheckCodeModal: React.FC<CheckCodeModalProps> = ({ isOpen, onClose }) => {
  const [userPrompt, setUserPrompt] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy')

  const handleSubmit = async () => {
    if (!userPrompt.trim() || !code.trim()) {
      setError('Both fields are required.')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('http://127.0.0.1:8000/check/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt: userPrompt, code })
      })

      const data = await res.json()
      if (res.ok) {
        setResponse(data.response)
      } else {
        setError(data.error || 'An error occurred')
      }
    } catch (err) {
      setError('Failed to connect to the server')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyButtonText('Copied!')
      setTimeout(() => setCopyButtonText('Copy'), 2000)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center pointer-events-none">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto pointer-events-auto">
        <h2 className="text-lg font-bold mb-4">Check Your Code</h2>

        {/* User Prompt Input */}
        <label className="block text-sm font-medium">User Prompt</label>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="textarea textarea-bordered w-full mb-2"
          placeholder="Enter your prompt"
        />

        {/* Code Input */}
        <label className="block text-sm font-medium">Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="textarea textarea-bordered w-full mb-2"
          placeholder="Paste your code here"
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Markdown Response with Syntax Highlighting */}
        {response && (
          <div className="border border-gray-300 rounded p-4 mt-4 bg-gray-100 max-h-[50vh] overflow-y-auto">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold my-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-semibold my-3" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-800 my-2" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 my-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-5 my-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-gray-700 my-1" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 pl-4 italic text-gray-950 my-4"
                    {...props}
                  />
                ),
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
                      <button
                        onClick={() => copyToClipboard(codeContent)}
                        className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white rounded text-sm hidden group-hover:block"
                      >
                        {copyButtonText}
                      </button>
                    </div>
                  ) : (
                    <code
                      className="bg-gray-200 text-red-600 px-2 py-1 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  )
                }
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="btn btn-outline">
            Close
          </button>
          <button
            onClick={handleSubmit}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckCodeModal
