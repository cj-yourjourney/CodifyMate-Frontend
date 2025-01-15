import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import ChatApp from './chat/components/ChatApp'
import TwoWayBinding from './playgound/TwoWayBinding'
// import Sidebar from './chat/components/Sidebar'

const App: React.FC = () => {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<ChatApp />} />
            <Route path='playground' element={<TwoWayBinding />} />
          </Routes>
    
    </Router>
  )
}

export default App
