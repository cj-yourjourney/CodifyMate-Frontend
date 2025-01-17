import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown' // Import ReactMarkdown for rendering Markdown
import remarkGfm from 'remark-gfm' // Support GitHub Flavored Markdown (tables, strikethrough, etc.)

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  refinePromptEndpoint: string // URL for the Django refine_prompt_view endpoint
}

const StructuredPromptModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  refinePromptEndpoint
}) => {
  const [featureRequest, setFeatureRequest] = useState('')
  const [objective, setObjective] = useState('')
  const [userCase, setUserCase] = useState('')
  const [relevantFiles, setRelevantFiles] = useState('')
  const [loading, setLoading] = useState(false)
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null)

  const handleRefinePrompt = async () => {
    if (!featureRequest || !objective || !userCase || !relevantFiles) {
      alert('Please fill out all fields.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(refinePromptEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'feature request': featureRequest,
          objective,
          'user case': userCase,
          'relevant files': relevantFiles
        })
      })

      const data = await response.json()
      if (data.status === 'success') {
        setRefinedPrompt(data.refined_prompt)
      } else {
        alert(data.error || 'Failed to refine the prompt.')
      }
    } catch (error) {
      alert('An error occurred while refining the prompt.')
    } finally {
      setLoading(false)
    }
  }

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Structured Prompt Input</h3>

        {/* Input Fields */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Feature Request</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={featureRequest}
            onChange={(e) => setFeatureRequest(e.target.value)}
            placeholder="Describe the feature request"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Objective</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="State the objective"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">User Case</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={userCase}
            onChange={(e) => setUserCase(e.target.value)}
            placeholder="Describe the user case"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Relevant Files</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={relevantFiles}
            onChange={(e) => setRelevantFiles(e.target.value)}
            placeholder="List relevant files"
            rows={3}
          />
        </div>

        {/* Refined Prompt Display */}
        {refinedPrompt && (
          <div
            className="mt-4 p-4 border rounded-lg bg-gray-100 overflow-auto"
            style={{
              backgroundColor: '#fffbea', // Light gray background (adjust as needed)
              color: '#5a4b41', // Dark gray text color (adjust as needed)
              fontSize: '1.1rem', // Slightly smaller font size for readability
              lineHeight: '1.6' // Adjust line spacing
            }}
          >
            <h4 className="font-semibold mb-2">Refined Prompt:</h4>
            <ReactMarkdown
              className="prose prose-sm max-w-none"
              children={refinedPrompt}
              remarkPlugins={[remarkGfm]}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-4 space-x-4">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button
            onClick={handleRefinePrompt}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
          >
            Refine Prompt
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default StructuredPromptModal
