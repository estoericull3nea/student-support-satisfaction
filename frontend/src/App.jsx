import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import Library from './Pages/Library'
import PrincipalOffice from './Pages/PrincipalOffice'
import SchoolRegistrar from './Pages/SchoolRegistrar'
import SchoolAdministrator from './Pages/SchoolAdministrator'
import Contact from './Pages/Contact'
import About from './Pages/About'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/library' element={<Library />} />
        <Route
          path='/office-of-the-school-principal'
          element={<PrincipalOffice />}
        />
        <Route path='/office-of-the-registrar' element={<SchoolRegistrar />} />
        <Route
          path='/office-of-the-school-administrator'
          element={<SchoolAdministrator />}
        />
        <Route path='/contact-us' element={<Contact />} />
        <Route path='/about-us' element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
