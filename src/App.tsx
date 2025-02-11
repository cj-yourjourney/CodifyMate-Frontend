import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
// import promptStore from './prompts/redux/promptStore'
import rootStore from './shared/redux/rootStore'
import ChatApp from './chat/components/ChatApp'
import TwoWayBinding from './playgound/TwoWayBinding'

const App: React.FC = () => {
  return (
    <Provider store={rootStore}>
      <Router>
        <Routes>
          <Route path="/" element={<ChatApp />} />
          <Route path="/playground" element={<TwoWayBinding />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
