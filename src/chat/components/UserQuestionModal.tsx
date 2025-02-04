import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown' // Import ReactMarkdown for rendering Markdown
import remarkGfm from 'remark-gfm' // Support GitHub Flavored Markdown (tables, strikethrough, etc.)

interface UserQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (question: string) => Promise<string> // Updated to return a response
}

const UserQuestionModal: React.FC<UserQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!question.trim()) return

    setLoading(true)
    try {
      const result = await onSubmit(question) // Fetch LLM response
      setResponse(result) // Store response in state
    } catch (error) {
      setResponse('Error fetching response.')
    }
    setLoading(false)
  }

  const handleNewQuestion = () => {
    setQuestion('')
    setResponse(null) // Reset response
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Ask a Project Question</h2>

        {!response ? (
          <>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question..."
              className="input input-bordered w-full"
              disabled={loading}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="btn btn-outline mr-2"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={!question.trim() || loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <h3 className="font-semibold">Response:</h3>
            <div
              className="mt-2 p-4 border rounded bg-gray-100 overflow-y-auto"
              style={{
                backgroundColor: '#fffbea',
                color: '#5a4b41',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                maxHeight: '60vh' // Ensure the response area is scrollable if it's too long
              }}
            >
              <ReactMarkdown
                className="prose prose-sm max-w-none"
                children={response}
                remarkPlugins={[remarkGfm]}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleNewQuestion}
                className="btn btn-secondary mr-2"
              >
                New Question
              </button>
              <button onClick={onClose} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserQuestionModal
