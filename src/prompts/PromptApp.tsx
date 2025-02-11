import React from 'react'
import { Provider } from 'react-redux'
import promptStore from './redux/promptStore'
import StructuredPromptModal from './components/StructuredPromptModal'

const PromptApp: React.FC = () => {
  return (
    <Provider store={promptStore}>
      <StructuredPromptModal />
    </Provider>
  )
}

export default PromptApp
