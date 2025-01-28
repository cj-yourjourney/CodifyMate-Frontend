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
  const [purpose, setPurpose] = useState('')
  const [functionality, setFunctionality] = useState('')
  const [data, setData] = useState('')
  const [design, setDesign] = useState('')
  const [integration, setIntegration] = useState('')
  const [loading, setLoading] = useState(false)
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null)

  const handleRefinePrompt = async () => {
    if (!purpose || !functionality || !data) {
      alert(
        'Please fill out all required fields (Purpose, Functionality, Data).'
      )
      return
    }

    setLoading(true)
    try {
      const payload: any = {
        purpose,
        functionality,
        data
      }
      // Include optional fields only if they are filled out
      if (design) payload.design = design
      if (integration) payload.integration = integration

      const response = await fetch(refinePromptEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const responseData = await response.json()
      if (responseData.status === 'success') {
        setRefinedPrompt(responseData.refined_prompt)
      } else {
        alert(responseData.error || 'Failed to refine the prompt.')
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
          <label className="block font-medium mb-1">Purpose</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="State the purpose of the feature, e.g., 'Build a React component for user profiles'"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Functionality</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={functionality}
            onChange={(e) => setFunctionality(e.target.value)}
            placeholder="Describe what the feature should do, e.g., 'Allow users to create, edit, and delete tasks'"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Data</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Specify the data involved, e.g., 'Task details: title, description, due date, priority'"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Design</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={design}
            onChange={(e) => setDesign(e.target.value)}
            placeholder="Describe the design requirements, e.g., 'A clean and minimal layout with drag-and-drop'"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Integration</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={integration}
            onChange={(e) => setIntegration(e.target.value)}
            placeholder="List any integration needs, e.g., 'Sync with Google Calendar for deadlines'"
            rows={3}
          />
        </div>

        {/* Refined Prompt Display */}
        {refinedPrompt && (
          <div
            className="mt-4 p-4 border rounded-lg bg-gray-100 overflow-auto"
            style={{
              backgroundColor: '#fffbea',
              color: '#5a4b41',
              fontSize: '1.1rem',
              lineHeight: '1.6'
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
