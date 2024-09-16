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
import NotFound from './Pages/NotFound'
import VerifyEmail from './Pages/VerifyEmail'
import Protect from './components/Protect'
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated'
import { Toaster } from 'react-hot-toast'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'
import Profile from './Pages/Profile'

// Admin Panel
import AdminApp from './admin/AdminApp'

const App = () => {
  return (
    <>
      <Toaster
        position='top-center'
        reverseOrder={false}
        containerClassName='text-xs'
      />
      {/* Toaster Component */}
      <Router>
        <Routes>
          {/* Admin Panel */}
          <Route path='/admin' element={<AdminApp />} />
          {/* End of Admin Panel */}

          <Route
            path='/profile'
            element={
              <Protect>
                <Profile />
              </Protect>
            }
          />
          <Route path='/' element={<LandingPage />} />
          <Route
            path='/reset-password/:resetToken'
            element={<ResetPassword />}
          />

          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/register'
            element={
              // Check if the user is already logged in then he/she can't access the login page anymore, unless he/she logged out
              <RedirectIfAuthenticated>
                <Register />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path='/login'
            element={
              // Check if the user is already logged in then he/she can't access the login page anymore, unless he/she logged out
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />
          <Route path='/library' element={<Library />} />
          <Route
            path='/office-of-the-school-principal'
            element={<PrincipalOffice />}
          />
          <Route
            path='/office-of-the-registrar'
            element={<SchoolRegistrar />}
          />
          <Route
            path='/office-of-the-school-administrator'
            element={<SchoolAdministrator />}
          />
          <Route path='/contact-us' element={<Contact />} />

          {/* Protected Route */}
          <Route
            path='/about-us'
            element={
              <Protect>
                <About />
              </Protect>
            }
          />
          <Route path='/verify' element={<VerifyEmail />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
