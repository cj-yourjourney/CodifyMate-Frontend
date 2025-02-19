import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PromptRootState, PromptAppDispatch } from '../state/promptStore'
import {
  setFeatureRequest,
  fetchRelevantFilePaths
} from '../state/slices/relevantFilePathSlice'
import MarkdownRenderer from '../shared/MarkdownRenderer'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  conversationId: string | null
}

const RelevantFilePathModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  conversationId
}) => {
  const dispatch = useDispatch<PromptAppDispatch>()
  const { featureRequest, responseMessage, loading, error } = useSelector(
    (state: PromptRootState) => state.filePath
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!featureRequest.trim() || !conversationId) return
    dispatch(fetchRelevantFilePaths({ featureRequest, conversationId }))
  }

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-amber-50 border border-amber-600 rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-screen overflow-y-auto">
        <h3 className="text-3xl font-extrabold text-amber-900 mb-6 tracking-wide border-b-4 border-amber-600 pb-2">
          Relevant File Path
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xl font-bold text-amber-800 tracking-wide mb-2">
              Enter your feature request:
            </label>
            <textarea
              className="w-full text-lg text-amber-900 bg-amber-100 border border-amber-500 rounded-xl p-4 placeholder-gray-800 focus:ring-4 focus:ring-amber-500 focus:outline-none transition-all duration-300 shadow-md leading-relaxed tracking-wide resize-none"
              value={featureRequest}
              onChange={(e) => dispatch(setFeatureRequest(e.target.value))}
              placeholder="Type your feature request here..."
              rows={4}
            />
          </div>

          {loading && (
            <span className="loading loading-dots loading-sm">Loading...</span>
          )}
          {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}

          {responseMessage && (
            <>
              <h4 className="font-extrabold text-4xl text-amber-900 mb-5 tracking-wider leading-tight">
                LLM Response:
              </h4>
              <MarkdownRenderer content={responseMessage} />
            </>
          )}

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              className="px-6 py-3 text-lg font-semibold text-gray-800 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className={`px-6 py-3 text-lg font-semibold text-white bg-amber-600 rounded-lg shadow-md hover:bg-amber-700 transition-all ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null
}

export default RelevantFilePathModal
