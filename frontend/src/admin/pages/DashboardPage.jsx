import React, { useState, useEffect } from 'react'

import Group from '../../assets/images/icons/group.png'
import ActiveUser from '../../assets/images/icons/active-user.png'
import InactiveUser from '../../assets/images/icons/inactive-user.png'
import Feedback from '../../assets/images/icons/feedback.png'
import Registerd from '../../assets/images/icons/registered.png'
import SignIn from '../../assets/images/icons/log-out.png'

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // Cleanup the interval on component unmount
    return () => clearInterval(timer)
  }, [])

  // Get the current hours, minutes, and seconds
  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')

  // Get the current day, month, and year
  const day = String(time.getDate()).padStart(2, '0')
  const month = String(time.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const year = time.getFullYear()

  return (
    <>
      <div className='w-max px-8 py-3 bg-base-100 shadow flex items-center gap-x-2'>
        <div className='text-sm font-medium'>
          {month}/{day}/{year}
        </div>
        <div className='text-sm font-medium'>
          {hours}:{minutes}:{seconds}
        </div>
      </div>

      <div className='flex flex-wrap gap-3'>
        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3'>
            <p className='text-xs text-gray-500'>Users</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>5k</h1>
              <img src={Group} alt='Manage Users Icon' className='w-6 h-6' />
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3'>
            <p className='text-xs text-gray-500'>Active Users</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>5k</h1>
              <img
                src={ActiveUser}
                alt='Manage Users Icon'
                className='w-6 h-6'
              />
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3'>
            <p className='text-xs text-gray-500'>Inactive Users</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>5k</h1>
              <img
                src={InactiveUser}
                alt='Manage Users Icon'
                className='w-6 h-6'
              />
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3'>
            <p className='text-xs text-gray-500'>Total Feedbacks</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>5k</h1>
              <img src={Feedback} alt='Manage Users Icon' className='w-6 h-6' />
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3'>
            <p className='text-xs text-gray-500'>Recent Registered User</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>5k</h1>
              <img
                src={Registerd}
                alt='Manage Users Icon'
                className='w-6 h-6'
              />
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3'>
            <p className='text-xs text-gray-500'>Recent Sign In User</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>5k</h1>
              <img src={SignIn} alt='Manage Users Icon' className='w-6 h-6' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RealTimeClock
