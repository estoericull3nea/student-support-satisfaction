import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'
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
import { toast } from 'react-hot-toast'

import Administrator from './components/Services/Administrator'
import Library from './components/Services/Library'
import Principal from './components/Services/Principal'
import Registrar from './components/Services/Registrar'

const AdminApp = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    toast.success('Logged out')
    navigate('/login')
  }

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
        <div className='navbar bg-base-100 lg:hidden shadow-lg mb-4 rounded-lg'>
          <div className='navbar-start w-max pr-3'>
            <div className='dropdown'>
              <div tabIndex={0} role='button'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h7'
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 p-2 shadow'
              >
                <ul className='menu rounded-box w-56'>
                  <li>
                    <a href='/admin/dashboard'>Dashboard</a>
                  </li>
                  <li>
                    <a href='/admin/feedbacks'>Feedbacks</a>
                  </li>
                  <li>
                    <details open>
                      <summary>Manage Students</summary>
                      <ul>
                        <li>
                          <a
                            href='/admin/students'
                            className='text-gray-500 text-sm'
                          >
                            All Students
                          </a>
                        </li>
                        <li>
                          <a
                            href='/admin/active-users'
                            className='text-gray-500 text-sm'
                          >
                            Active Students
                          </a>
                        </li>
                        <li>
                          <a
                            href='/admin/inactive-users'
                            className='text-gray-500 text-sm'
                          >
                            Inactive Students
                          </a>
                        </li>
                        <li>
                          <a
                            href='/admin/admins'
                            className='text-gray-500 text-sm'
                          >
                            Admins
                          </a>
                        </li>
                      </ul>
                    </details>
                  </li>

                  <li>
                    <details open>
                      <summary>Services</summary>
                      <ul>
                        <li>
                          <a
                            href='/admin/library'
                            className='text-gray-500 text-sm'
                          >
                            Library
                          </a>
                        </li>
                        <li>
                          <a
                            href='/admin/principal'
                            className='text-gray-500 text-sm'
                          >
                            Office of the School Principal
                          </a>
                        </li>
                        <li>
                          <a
                            href='/admin/administrator'
                            className='text-gray-500 text-sm'
                          >
                            Office of the School Administrator
                          </a>
                        </li>
                        <li>
                          <a
                            href='/admin/registrar'
                            className='text-gray-500 text-sm'
                          >
                            Office of the School Registrar
                          </a>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details open>
                      <summary>Queries</summary>
                      <ul>
                        <li>
                          <a
                            href='/admin/student-queries'
                            className='text-gray-500 text-sm'
                          >
                            Student Queries
                          </a>
                        </li>
                        <li>
                          <a
                            href='/admin/non-student-quries'
                            className='text-gray-500 text-sm'
                          >
                            Non-Student Queries
                          </a>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </ul>
            </div>
          </div>
          <div className='navbar-center'>
            <a className='font-semibold text-sm'>Student Support Admin</a>
          </div>
        </div>

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
