import React from 'react'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'
import { Link } from 'react-router-dom'

import Dashboard from '../../assets/images/icons/dashboard.png'
import Group from '../../assets/images/icons/group.png'
import Settings from '../../assets/images/icons/settings.png'
import ActiveUser from '../../assets/images/icons/add-friend.png'
import App from '../../assets/images/icons/app.png'

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div
      className={`bg-base-200 h-full transition-all ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className='flex justify-between items-center p-4 bg-primary text-white'>
        <h2 className={`${isCollapsed ? 'hidden' : 'block'} text-lg`}>Admin</h2>
        <button onClick={toggleSidebar}>
          <HiOutlineMenuAlt2 className='text-xl' />
        </button>
      </div>

      <ul className='menu p-4'>
        <li>
          <Link to='/admin/dashboard'>
            <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
              <img src={Dashboard} alt='Dashboard Icon' className='w-6 h-6' />
              {!isCollapsed && <span>Dashboard</span>}
            </div>
          </Link>
        </li>

        <div
          tabIndex={0}
          className='collapse collapse-arrow border-base-300 bg-base-200 border'
        >
          <div className='collapse-title text-sm font-medium p-0 text-center flex items-center justify-between px-10'>
            <img src={Group} alt='Manage Users Icon' className='w-6 h-6' />
            Manage Users
          </div>
          <div className='collapse-content'>
            <li>
              <Link to='/admin/active-users'>
                <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
                  <img
                    src={ActiveUser}
                    alt='Inactive Users Icon'
                    className='w-6 h-6'
                  />
                  {!isCollapsed && <span>Active Users</span>}
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
                  {!isCollapsed && <span>Inactive Users</span>}
                </div>
              </Link>
            </li>
          </div>
        </div>

        <li>
          <Link to='/admin/settings'>
            <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
              <img src={Settings} alt='Settings Icon' className='w-6 h-6' />
              {!isCollapsed && <span>Settings</span>}
            </div>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
