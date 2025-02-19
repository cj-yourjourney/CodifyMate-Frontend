import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PromptRootState, PromptAppDispatch } from '../state/promptStore'
import { setPromptField, refinePrompt } from '../state/slices/promptSlice'
import MarkdownRenderer from '../shared/MarkdownRenderer'
import ModalContainer from '../shared/ModalContainer'

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

  const handleSubmit = () => {
    if (!purpose || !functionality || !data) {
      alert('Please fill out all required fields.')
      return
    }
    dispatch(
      refinePrompt({ purpose, functionality, data, design, integration })
    )
  }

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Structured Prompt Input"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }} // Fix: Now it submits!
      loading={loading}
    >
      {['purpose', 'functionality', 'data', 'design', 'integration'].map(
        (field) => (
          <textarea
            key={field}
            className="w-full text-lg text-amber-900 bg-amber-100 border border-amber-500 rounded-xl p-4"
            value={eval(field)}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={`Enter ${field}...`}
            rows={4}
          />
        )
      )}
      {refinedPrompt && <MarkdownRenderer content={refinedPrompt} />}
      {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}
    </ModalContainer>
  )

}

export default StructuredPromptModal
