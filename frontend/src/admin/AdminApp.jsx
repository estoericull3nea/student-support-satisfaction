import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import ActiveUsersPage from './pages/ActiveUsersPage'
import SettingsPage from './pages/SettingsPage'
import InactiveUsersPage from './pages/InactiveUsersPage'
import StudentsQueryPage from './pages/StudentsQueryPage'
import NonStudentsQueryPage from './pages/NonStudentsQueryPage'
import AdminsPage from './pages/AdminsPage'
import AllUsers from './pages/AllUsers'
import Feedbacks from './pages/Feedbacks'

import Administrator from './components/Services/Administrator'
import Library from './components/Services/Library'
import Principal from './components/Services/Principal'
import Registrar from './components/Services/Registrar'

const AdminApp = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize() // Set initial state based on current screen size

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className='flex w-screen'>
      <Sidebar />
      <div className='flex-1 p-6 overflow-hidden'>
        <Routes>
          <Route path='/' element={<DashboardPage />} />

          <Route path='/library' element={<Library />} />
          <Route path='/administrator' element={<Administrator />} />
          <Route path='/principal' element={<Principal />} />
          <Route path='/registrar' element={<Registrar />} />

          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/feedbacks' element={<Feedbacks />} />
          <Route path='/students' element={<AllUsers />} />
          <Route path='/admins' element={<AdminsPage />} />
          <Route path='/student-queries' element={<StudentsQueryPage />} />
          <Route
            path='/non-student-quries'
            element={<NonStudentsQueryPage />}
          />
          <Route path='/active-users' element={<ActiveUsersPage />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/inactive-users' element={<InactiveUsersPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminApp
