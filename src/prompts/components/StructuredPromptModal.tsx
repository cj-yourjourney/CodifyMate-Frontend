import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PromptRootState, PromptAppDispatch } from '../state/promptStore'
import { setPromptField, refinePrompt } from '../state/slices/promptSlice'
import MarkdownRenderer from '../shared/MarkdownRenderer'

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
    dispatch(
      refinePrompt({ purpose, functionality, data, design, integration })
    )
  }

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-amber-50 border border-amber-600 rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-screen overflow-y-auto">
        <h3 className="text-3xl font-extrabold text-amber-900 mb-6 tracking-wide border-b-4 border-amber-600 pb-2">
          Structured Prompt Input
        </h3>

        {['purpose', 'functionality', 'data', 'design', 'integration'].map(
          (field) => (
            <div key={field} className="mb-6">
              <label className="block text-xl font-bold text-amber-800 tracking-wide mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <textarea
                className="w-full text-lg text-amber-900 bg-amber-100 border border-amber-500 rounded-xl p-4 placeholder-gray-800 focus:ring-4 focus:ring-amber-500 focus:outline-none transition-all duration-300 shadow-md leading-relaxed tracking-wide resize-none"
                value={promptFields[field as keyof typeof promptFields] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={`Enter ${field}...`}
                rows={4}
              />
            </div>
          )
        )}

        {refinedPrompt && (
          <>
            <h4 className="font-extrabold text-4xl text-amber-900 mb-5 tracking-wider leading-tight">
              Refined Prompt:
            </h4>
            <MarkdownRenderer content={refinedPrompt} />
          </>
        )}

        {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-lg font-semibold text-gray-800 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className={`px-6 py-3 text-lg font-semibold text-white bg-amber-600 rounded-lg shadow-md hover:bg-amber-700 transition-all ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Refining...' : 'Refine Prompt'}
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default StructuredPromptModal
