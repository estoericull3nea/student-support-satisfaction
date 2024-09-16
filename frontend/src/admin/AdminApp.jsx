import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

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
    handleResize() // Initialize the state based on current screen size

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className='flex h-screen'>
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <MainContent isSidebarCollapsed={isSidebarCollapsed} />
    </div>
  )
}

export default AdminApp
