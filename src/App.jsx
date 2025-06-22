import React, { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Layout from './components/common/Layout'
import { DarkModeProvider } from './context/DarkModeContext'

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Layout />
      </Router>
    </DarkModeProvider>
  )
}

export default App