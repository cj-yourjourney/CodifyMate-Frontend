// prompts/components/RelevantFilePathModal.tsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PromptRootState, PromptAppDispatch } from '../state/promptStore'
import {
  setFeatureRequest,
  fetchRelevantFilePaths
} from '../state/slices/relevantFilePathSlice'
import MarkdownRenderer from '../shared/MarkdownRenderer'
import ModalContainer from '../shared/ModalContainer'
import { RootState } from '../../shared/redux/rootStore'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  conversationId?: string
}

const RelevantFilePathModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  conversationId: propConversationId
}) => {
  const dispatch = useDispatch<PromptAppDispatch>()
  const { featureRequest, responseMessage, loading, error } = useSelector(
    (state: PromptRootState) => state.filePath
  )
  // Also get conversationId from chat state as a fallback
  const chatConversationId = useSelector(
    (state: RootState) => state.chat.conversationId
  )
  const conversationId = propConversationId || chatConversationId || ''

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(
      'Submitting with conversationId:',
      conversationId,
      'and featureRequest:',
      featureRequest
    )
    if (!featureRequest.trim() || !conversationId) {
      console.error('Missing conversationId or featureRequest')
      return
    }
    dispatch(fetchRelevantFilePaths({ featureRequest, conversationId }))
  }

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Relevant File Path"
      onSubmit={handleSubmit}
      loading={loading}
    >
      <textarea
        className="w-full text-lg text-amber-900 bg-amber-100 border border-amber-500 rounded-xl p-4"
        value={featureRequest}
        onChange={(e) => dispatch(setFeatureRequest(e.target.value))}
        placeholder="Type your feature request here..."
        rows={4}
      />
      {loading && (
        <span className="loading loading-dots loading-sm">Loading...</span>
      )}
      {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}
      {responseMessage && <MarkdownRenderer content={responseMessage} />}
    </ModalContainer>
  )
}

export default RelevantFilePathModal
