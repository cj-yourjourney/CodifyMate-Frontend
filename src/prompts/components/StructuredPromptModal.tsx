import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PromptRootState, PromptAppDispatch } from '../redux/promptStore'
import { setPromptField, refinePrompt } from '../redux/slices/promptSlice'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const StructuredPromptModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<PromptAppDispatch>()
  const {
    purpose,
    functionality,
    data,
    design,
    integration,
    refinedPrompt,
    loading,
    error
  } = useSelector((state: PromptRootState) => state.prompt)

  const handleInputChange = (field: string, value: string) => {
    dispatch(setPromptField({ field, value }))
  }
  const promptFields = { purpose, functionality, data, design, integration }

  const handleSubmit = () => {
    if (!purpose || !functionality || !data) {
      alert(
        'Please fill out all required fields (Purpose, Functionality, Data).'
      )
      return
    }
    console.log(data)
    dispatch(
      refinePrompt({ purpose, functionality, data, design, integration })
    )
  }

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Structured Prompt Input</h3>

        {['purpose', 'functionality', 'data', 'design', 'integration'].map(
          (field) => (
            <div key={field} className="mb-4">
              <label className="block font-medium mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={promptFields[field as keyof typeof promptFields] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={`Enter ${field}...`}
                rows={3}
              />
            </div>
          )
        )}

        {refinedPrompt && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h4 className="font-semibold mb-2">Refined Prompt:</h4>
            <ReactMarkdown
              className="prose prose-sm max-w-none"
              children={refinedPrompt}
              remarkPlugins={[remarkGfm]}
            />
          </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="flex justify-end mt-4 space-x-4">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button
            onClick={handleSubmit}
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
