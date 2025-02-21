import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import rootStore from './shared/redux/rootStore'
import ChatApp from './chat/pages/ChatApp'
import TwoWayBinding from './playgound/TwoWayBinding'
import { Sidebar } from './shared/components/Sidebar'

const App: React.FC = () => {
  return (
    <Provider store={rootStore}>
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<ChatApp />} />
              <Route path="/playground" element={<TwoWayBinding />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  )
}

export default App
