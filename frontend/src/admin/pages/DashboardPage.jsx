import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Group from '../../assets/images/icons/group.png'
import ActiveUser from '../../assets/images/icons/active-user.png'
import InactiveUser from '../../assets/images/icons/inactive-user.png'
import FeedbackIcon from '../../assets/images/icons/feedback.png'
import Registered from '../../assets/images/icons/registered.png'
import SignIn from '../../assets/images/icons/log-out.png'
import { formatTime } from '../../utils.js'
import FeedbacksAnalytics from '../components/FeedbacksAnalytics'
import StudentRegistersAnalytics from '../components/StudentRegistersAnalytics'
import ServiceAnalytics from '../components/Services/ServiceAnalytics'
import { Link } from 'react-router-dom'
import FeedbacksByAllServicesInOne from '../components/FeedbacksByAllServicesInOne'
import FeedbacksByRating from '../components/FeedbacksByRating'

import { io } from 'socket.io-client'
const socket = io(import.meta.env.VITE_PROD_BACKEND_URL)

const DashboardPage = () => {
  const [time, setTime] = useState(new Date())
  const [topTenServiceFeedback, setTopTenServiceFeedback] = useState([])
  const [topTenRecentRegisteredUsers, setTopTenRecentRegisteredUsers] =
    useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalFeedbacks: 0,
    contactStudentCount: 0,
    contactNonStudentCount: 0,
    recentRegisteredUsers: [],
    recentSigninUsers: [],
  })
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    socket.on('newFeedback', (newFeedback) => {
      console.log('New feedback received:', newFeedback)
      setTrigger((prevTrigger) => prevTrigger + 1)

      // setStats((prevStats) => ({
      //   ...prevStats,
      //   totalFeedbacks: prevStats.totalFeedbacks + 1,
      // }))

      setTopTenServiceFeedback((prevFeedbacks) => {
        const existingService = prevFeedbacks.find(
          (service) => service._id === newFeedback.serviceName
        )

        if (existingService) {
          return prevFeedbacks.map((service) =>
            service._id === newFeedback.serviceName
              ? { ...service, totalCount: service.totalCount + 1 }
              : service
          )
        } else {
          return [
            ...prevFeedbacks,
            { _id: newFeedback.serviceName, totalCount: 1 },
          ]
        }
      })
    })

    socket.on('newContact', (data) => {
      setTrigger((prevTrigger) => prevTrigger + 1)
    })

    return () => {
      socket.off('newFeedback')
      socket.off('newContact')
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_BACKEND_URL}/api/count/stats`
        )
        setStats(response.data.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [trigger])

  useEffect(() => {
    const fetchTopTenMostRatedService = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_PROD_BACKEND_URL
          }/api/count/top-service-feedbacks`
        )
        setTopTenServiceFeedback(response.data.data)
      } catch (error) {
        console.error('Error fetching top services:', error)
      }
    }

    fetchTopTenMostRatedService()
  }, [])

  useEffect(() => {
    const fetchTopTenRecentRegisteredUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_BACKEND_URL}/api/count/top-ten-users`
        )
        setTopTenRecentRegisteredUsers(response.data.data)
      } catch (error) {
        console.error('Error fetching top services:', error)
      }
    }

    fetchTopTenRecentRegisteredUsers()
    console.log(topTenRecentRegisteredUsers)
  }, [])

  const getFormattedTime = (time) => {
    let hours = time.getHours()
    const minutes = String(time.getMinutes()).padStart(2, '0')
    const seconds = String(time.getSeconds()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12

    return `${hours}:${minutes}:${seconds} ${ampm}`
  }

  const day = String(time.getDate()).padStart(2, '0')
  const month = String(time.getMonth() + 1).padStart(2, '0')
  const year = time.getFullYear()

  return (
    <>
      <div className='w-max px-8 py-3 bg-base-100 shadow flex items-center gap-x-2'>
        <div className='text-sm font-medium'>
          {month}/{day}/{year}
        </div>
        <div className='text-sm font-medium'>{getFormattedTime(time)}</div>
      </div>

      <div className='flex flex-wrap gap-3 items-center justify-start  my-10 w-full'>
        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3 relative'>
            <p className='text-xs text-gray-500'>All Students Registered</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>{stats.totalUsers}</h1>
              <img src={Group} alt='Manage Users Icon' className='w-6 h-6' />
            </div>
            <div className='text-end w-full absolute top-1 right-3'>
              <Link
                to='/admin/students'
                className='text-[.6rem] underline decoration-blue-600 text text-blue-600'
              >
                View
              </Link>
            </div>
          </div>
        </div>

        {/*  dev */}
        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3 relative'>
            <p className='text-xs text-gray-500'>All Students Queries</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>
                {stats.contactStudentCount}
              </h1>
              <img src={Group} alt='Manage Users Icon' className='w-6 h-6' />
            </div>
            <div className='text-end w-full absolute top-1 right-3'>
              <Link
                to='/admin/student-queries'
                className='text-[.6rem] underline decoration-blue-600 text text-blue-600'
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3 relative'>
            <p className='text-xs text-gray-500'>All Non-Students Queries</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>
                {stats.contactNonStudentCount}
              </h1>
              <img src={Group} alt='Manage Users Icon' className='w-6 h-6' />
            </div>
            <div className='text-end w-full absolute top-1 right-3'>
              <Link
                to='/admin/non-student-quries'
                className='text-[.6rem] underline decoration-blue-600 text text-blue-600'
              >
                View
              </Link>
            </div>
          </div>
        </div>
        {/*  dev */}

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3 relative'>
            <p className='text-xs text-gray-500'>Active Students</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>{stats.activeUsers}</h1>
              <img
                src={ActiveUser}
                alt='Active Users Icon'
                className='w-6 h-6'
              />
            </div>
            <div className='text-end w-full absolute top-1 right-3'>
              <Link
                to='/admin/active-users'
                className='text-[.6rem] underline decoration-blue-600 text text-blue-600'
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3 relative'>
            <p className='text-xs text-gray-500'>Inactive Users</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>{stats.inactiveUsers}</h1>
              <img
                src={InactiveUser}
                alt='Inactive Users Icon'
                className='w-6 h-6'
              />
            </div>
            <div className='text-end w-full absolute top-1 right-3'>
              <Link
                to='/admin/inactive-users'
                className='text-[.6rem] underline decoration-blue-600 text text-blue-600'
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3 relative'>
            <p className='text-xs text-gray-500'>Total Feedbacks</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-4xl font-bold'>{stats.totalFeedbacks}</h1>
              <img src={FeedbackIcon} alt='Feedback Icon' className='w-6 h-6' />
            </div>
            <div className='text-end w-full absolute top-1 right-3'>
              <Link
                to='/admin/feedbacks'
                className='text-[.6rem] underline decoration-blue-600 text text-blue-600'
              >
                View
              </Link>
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3'>
            <p className='text-xs text-gray-500'>Recent Registered User</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-xl font-bold'>
                {stats.recentRegisteredUsers[0]?.firstName || 'N/A'}
              </h1>
              <img
                src={Registered}
                alt='Registered User Icon'
                className='w-6 h-6'
              />
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <div className='w-[200px] p-3 bg-base-100 shadow flex items-start gap-x-2 flex-col gap-y-3'>
            <p className='text-xs text-gray-500'>Recent Sign In User</p>
            <div className='w-full flex justify-between items-center'>
              <h1 className='text-xl font-bold'>
                {stats.recentSigninUsers[0]?.firstName || 'N/A'}
              </h1>
              <img src={SignIn} alt='Sign In Icon' className='w-6 h-6' />
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5'>
        <div className='shadow-lg p-3  bg-base-100 w-full'>
          <div className='w-full mt-10'>
            <h2 className='text-sm font-medium mb-4'>
              Top 10 Most Rated Feedback Services
            </h2>
            <div className='overflow-x-auto'>
              <table className='table w-full text-xs'>
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Total Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {topTenServiceFeedback.map((service, index) => (
                    <tr key={index}>
                      <td>{service._id}</td>
                      <td>{service.totalCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 mt-10'>
        <FeedbacksAnalytics trigger={trigger} />
        <StudentRegistersAnalytics />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-4 mt-10'>
        <ServiceAnalytics trigger={trigger} serviceName='Library' />
        <ServiceAnalytics
          trigger={trigger}
          serviceName='Office of the School Principal'
        />
        <ServiceAnalytics
          trigger={trigger}
          serviceName='Office of the School Administrator'
        />
        <ServiceAnalytics
          trigger={trigger}
          serviceName='Office of the Registrar'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2'>
        <FeedbacksByAllServicesInOne trigger={trigger} />
        <FeedbacksByRating trigger={trigger} />
      </div>
    </>
  )
}

export default DashboardPage
