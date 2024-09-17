import React from 'react'

const MainContent = () => {
  return (
    <div className='flex-1 p-6 transition-all bg-red-800'>
      <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
      <div className='mt-4'>
        <p className='text-gray-600'>
          This is the main content area where you can manage users, feedback,
          and view reports.
        </p>
      </div>
    </div>
  )
}

export default MainContent
