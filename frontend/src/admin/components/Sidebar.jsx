import React from 'react'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'

import Dashboard from '../../assets/images/icons/dashboard.png'
import Group from '../../assets/images/icons/group.png'
import Settings from '../../assets/images/icons/settings.png'
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
          <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
            <img src={Dashboard} alt='Dashboard Icon' className='w-6 h-6' />
            {!isCollapsed && <span>Dashboard</span>}
          </div>
        </li>

        <li>
          <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
            <img src={Group} alt='Group Icon' className='w-6 h-6' />
            {!isCollapsed && <span>Manage Users</span>}
          </div>
        </li>

        <li>
          <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
            <img src={Settings} alt='Settings Icon' className='w-6 h-6' />
            {!isCollapsed && <span>Settings</span>}
          </div>
        </li>

        <li>
          <div className='flex items-center gap-5 justify-start px-0 md:py-2'>
            <img src={App} alt='Settings Icon' className='w-6 h-6' />
            {!isCollapsed && <span>Inactive Users</span>}
          </div>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
