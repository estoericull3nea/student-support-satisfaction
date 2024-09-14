import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Breadcrumbs from '../components/Breadcrumbs'
import Footer from '../components/Footer'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const Profile = () => {
  const token = localStorage.getItem('token')
  const decoded = token ? jwtDecode(token) : ''

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setUser(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [decoded.id])

  if (loading) {
    return <div className='p-1 text-xs'>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <Navbar />
      <Breadcrumbs />

      <div className='container'>
        <div className='my-10 flex flex-wrap justify-center gap-3'>
          <div className='left'>
            <div className='box h-[300px] w-[350px] border shadow-lg rounded-lg flex flex-col justify-center items-center gap-y-2 relative'>
              <div className='avatar'>
                <div className='w-24 rounded-full'>
                  <img src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' />
                </div>
              </div>

              <h1 className='text-3xl font-semibold'>{`${user.firstName} ${user.lastName}`}</h1>
              <h2 className='text-sm'>{`${user.email}`}</h2>

              <span className='text-[.7rem] absolute bottom-3 right-3 font-medium bg-primary text-white py-1 px-3 rounded-full'>
                Created At: <span className='font-bold'>{user.createdAt}</span>
              </span>
            </div>
          </div>

          <div className='right'>
            <div className='box h-[500px] w-[600px] border shadow-lg rounded-lg'></div>
          </div>
        </div>

        <div
          role='tablist'
          className='tabs tabs-lifted max-w-[1000px] mx-auto mb-10'
        >
          <input
            type='radio'
            name='my_tabs_2'
            role='tab'
            className='tab'
            aria-label='Accounts Settings'
          />
          <div
            role='tabpanel'
            className='tab-content bg-base-100 border-base-300 rounded-box p-6'
          >
            Accounts Settings
          </div>

          <input
            type='radio'
            name='my_tabs_2'
            role='tab'
            className='tab'
            aria-label='Feedback History'
            defaultChecked
          />
          <div
            role='tabpanel'
            className='tab-content bg-base-100 border-base-300 rounded-box p-6'
          >
            Feedback History
          </div>

          <input
            type='radio'
            name='my_tabs_2'
            role='tab'
            className='tab'
            aria-label='Login History'
          />

          <div
            role='tabpanel'
            className='tab-content bg-base-100 border-base-300 rounded-box p-6'
          >
            Login History
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Profile
