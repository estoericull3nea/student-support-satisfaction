import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import Library from './Pages/Library'
import PrincipalOffice from './Pages/PrincipalOffice'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/library' element={<Library />} />
        <Route path='/school-principal' element={<PrincipalOffice />} />
      </Routes>
    </Router>
  )
}

export default App
