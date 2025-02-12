import React, { useState } from 'react'
import MarkdownRenderer from '../shared/MarkdownRenderer'

type RelevantFilePathModalProps = {
  isOpen: boolean
  onClose: () => void
  conversationId: string | null
}

const RelevantFilePathModal: React.FC<RelevantFilePathModalProps> = ({
  isOpen,
  onClose,
  conversationId
}) => {
  // Reuse the state variable from before (the value represents the feature request)
  const [featureRequest, setFeatureRequest] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Do not submit if the input is empty or if conversationId is missing
    if (!featureRequest.trim() || !conversationId) return

    setLoading(true)
    setError(null)
    setResponseMessage(null)

    try {
      const res = await fetch('http://127.0.0.1:8000/prompt/get-file-paths/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature_request: featureRequest,
          conversation_id: conversationId
        })
      })
      const data = await res.json()

      if (data.status === 'success') {
        setResponseMessage(data.response)
        setFeatureRequest('') // Clear the input field after submission
      } else {
        setError(data.message || 'An error occurred.')
      }
    } catch (err) {
      setError('An error occurred while submitting the request.')
    } finally {
      setLoading(false)
    }
  }

  // Render nothing if the modal is not open.
  if (!isOpen) return null

  return (
    <div
      className="modal modal-open"
      style={{ pointerEvents: 'none', backgroundColor: 'transparent' }}
    >
      <div
        className="modal-box w-11/12 max-w-5xl"
        style={{ pointerEvents: 'auto' }}
      >
        <h3 className="font-bold text-lg">Relevant File Path</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control my-4">
            <label className="label">
              <span className="label-text">Enter your feature request:</span>
            </label>
            <input
              type="text"
              value={featureRequest}
              onChange={(e) => setFeatureRequest(e.target.value)}
              className="input input-bordered"
              placeholder="Type your feature request here..."
            />
          </div>

          {loading && (
            <div className="my-2">
              <span className="loading loading-dots loading-sm"></span>{' '}
              Loading...
            </div>
          )}

          {error && <div className="my-2 text-red-500">{error}</div>}

          {/* ----------------- Updated Markdown Rendering Section ----------------- */}
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
            <button type="submit" className="btn btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RelevantFilePathModal
