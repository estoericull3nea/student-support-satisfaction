import React from 'react'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import Dashboard from '../../assets/images/icons/dashboard.png'
import Group from '../../assets/images/icons/group.png'
import Settings from '../../assets/images/icons/settings.png'
import ActiveUser from '../../assets/images/icons/add-friend.png'
import Building from '../../assets/images/icons/building.png'
import Book from '../../assets/images/icons/book.png'
import Principal from '../../assets/images/icons/principal.png'
import Blogger from '../../assets/images/icons/blogger.png'
import People from '../../assets/images/icons/people.png'
import Query from '../../assets/images/icons/query.png'
import User from '../../assets/images/icons/user.png'
import NotStudent from '../../assets/images/icons/not-student.png'
import Students from '../../assets/images/icons/students.png'
import Logout from '../../assets/images/icons/logout.png'
import Graduation from '../../assets/images/icons/graduation.png'
import Feedback from '../../assets/images/icons/feedback.png'
import App from '../../assets/images/icons/app.png'

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <div className='hidden lg:block'>
      <div
        className={`bg-base-200 h-full transition-all ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className='flex justify-between items-center p-4 bg-primary text-white'>
          <h2 className={`${isCollapsed ? 'hidden' : 'block'} text-lg`}>
            Admin
          </h2>
          <button onClick={toggleSidebar}>
            <HiOutlineMenuAlt2 className='text-xl' />
          </button>
        </div>

        <ul className='menu p-4 text-xs'>
          <li>
            <Link to='/admin/dashboard'>
              <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                <img src={Dashboard} alt='Dashboard Icon' className='w-6 h-6' />
                {!isCollapsed && <span>Dashboard</span>}
              </div>
            </Link>
          </li>

          <li>
            <Link to='/admin/feedbacks'>
              <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                <img src={Feedback} alt='Dashboard Icon' className='w-6 h-6' />
                {!isCollapsed && <span>Feedbacks</span>}
              </div>
            </Link>
          </li>

          <div className='space-y-2'>
            <ul className='menu bg-base-200 rounded-box '>
              <li>
                <details>
                  <summary className='px-2'>
                    {' '}
                    <img
                      src={Group}
                      alt='Manage Users Icon'
                      className='w-6 h-6'
                    />{' '}
                    Manage Students
                  </summary>
                  <ul>
                    <li>
                      <Link to='/admin/students'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={Graduation}
                            alt='Inactive Users Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && <span>All Students</span>}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to='/admin/active-users'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={ActiveUser}
                            alt='Inactive Users Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && <span>Active Students</span>}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to='/admin/inactive-users'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={App}
                            alt='Inactive Users Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && <span>Inactive Students</span>}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to='/admin/admins'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={User}
                            alt='Dashboard Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && <span>Admins</span>}
                        </div>
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>

            <ul className='menu bg-base-200 rounded-box '>
              <li>
                <details>
                  <summary className='px-2'>
                    <img
                      src={Building}
                      alt='Manage Users Icon'
                      className='w-6 h-6'
                    />
                    Services
                  </summary>
                  <ul>
                    <li>
                      <Link to='/admin/library'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={Book}
                            alt='Inactive Users Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && <span>Library</span>}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to='/admin/principal'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={Principal}
                            alt='Inactive Users Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && (
                            <span>Office of the School Principal</span>
                          )}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to='/admin/administrator'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={Blogger}
                            alt='Inactive Users Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && (
                            <span>Office of the School Administrator</span>
                          )}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to='/admin/registrar'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={People}
                            alt='Inactive Users Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && (
                            <span>Office of the School Registrar</span>
                          )}
                        </div>
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>

            <ul className='menu bg-base-200 rounded-box '>
              <li>
                <details>
                  <summary className='px-2'>
                    <img
                      src={Query}
                      alt='Manage Users Icon'
                      className='w-6 h-6'
                    />
                    Queries
                  </summary>
                  <ul>
                    <li>
                      <Link to='/admin/student-queries'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={Students}
                            alt='Inactive Users Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && <span>Student Queries</span>}
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to='/admin/non-student-quries'>
                        <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                          <img
                            src={NotStudent}
                            alt='Inactive Users Icon'
                            className='w-6 h-6'
                          />
                          {!isCollapsed && <span>Non-Student Queries</span>}
                        </div>
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>

          <li>
            <button onClick={handleLogout}>
              <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                <img src={Logout} alt='Settings Icon' className='w-6 h-6' />
                {!isCollapsed && <span>Logout</span>}
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
