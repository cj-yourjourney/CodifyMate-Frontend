import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PromptRootState, PromptAppDispatch } from '../redux/promptStore'
import {
  setFeatureRequest,
  fetchRelevantFilePaths
} from '../redux/slices/relevantFilePathSlice'
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
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Relevant File Path</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control my-4">
            <label className="label">
              <span className="label-text">Enter your feature request:</span>
            </label>
            <input
              type="text"
              value={featureRequest}
              onChange={(e) => dispatch(setFeatureRequest(e.target.value))}
              className="input input-bordered"
              placeholder="Type your feature request here..."
            />
          </div>

          {loading && (
            <span className="loading loading-dots loading-sm"> Loading...</span>
          )}
          {error && <div className="my-2 text-red-500">{error}</div>}

          {responseMessage && (
            <>
              <h4 className="font-semibold mb-2">LLM Response:</h4>
              <MarkdownRenderer content={responseMessage} />
            </>
          )}

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Close
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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
