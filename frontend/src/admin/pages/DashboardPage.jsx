import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Group from '../../assets/images/icons/group.png'
import ActiveUser from '../../assets/images/icons/active-user.png'
import InactiveUser from '../../assets/images/icons/inactive-user.png'
import FeedbackIcon from '../../assets/images/icons/feedback.png'
import Registered from '../../assets/images/icons/registered.png'
import SignIn from '../../assets/images/icons/log-out.png'
import { formatTime } from '../../utils.js'
import FeedbacksAnalytics from '../components/feedbacksAnalytics.jsx'
import StudentRegistersAnalytics from '../components/StudentRegistersAnalytics.jsx'
import ServiceAnalytics from '../components/Services/ServiceAnalytics.jsx'
import { Link } from 'react-router-dom'
import FeedbacksByAllServicesInOne from '../components/FeedbacksByAllServicesInOne.jsx'

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
    recentRegisteredUsers: [],
    recentSigninUsers: [],
  })

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
          'http://localhost:5000/api/count/stats'
        )
        setStats(response.data.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchTopTenMostRatedService = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/count/top-service-feedbacks'
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
          'http://localhost:5000/api/count/top-ten-users'
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

      <div className='flex flex-wrap gap-3 items-center justify-center lg:justify-between my-10'>
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
              <h1 className='text-4xl font-bold'>
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
              <h1 className='text-4xl font-bold'>
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

        <div className='shadow-lg p-3  bg-base-100 w-full'>
          <div className='w-full mt-10'>
            <h2 className='text-sm font-medium mb-4'>
              Top 10 Recent Registered Users
            </h2>
            <div className='overflow-x-auto'>
              <table className='table w-full text-xs'>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Is Verified</th>
                    <th>Role</th>
                    <th>CreatedAt</th>
                  </tr>
                </thead>
                <tbody>
                  {topTenRecentRegisteredUsers.map((data, index) => (
                    <tr key={index}>
                      <td>
                        {data.firstName} {data.lastName}
                      </td>
                      <td>{data.email}</td>
                      <td
                        className={
                          data.isVerified
                            ? 'text-green-700 font-bold'
                            : 'text-red-700 font-bold'
                        }
                      >
                        {data.isVerified ? 'Verified' : 'Not Verified'}
                      </td>
                      <td>{data.role}</td>
                      <td>{formatTime(data.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 mt-10'>
        <FeedbacksAnalytics />
        <StudentRegistersAnalytics />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-4 mt-10'>
        <ServiceAnalytics serviceName='Library' />
        <ServiceAnalytics serviceName='Office of the School Principal' />
        <ServiceAnalytics serviceName='Office of the School Administrator' />
        <ServiceAnalytics serviceName='Office of the Registrar' />
      </div>

      <div>
        <FeedbacksByAllServicesInOne />
      </div>
    </>
  )
}

export default DashboardPage
