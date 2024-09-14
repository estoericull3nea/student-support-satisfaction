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
  const [loadingUser, setUserLoading] = useState(true)
  const [errorUser, setErrorUser] = useState(null)

  const [feedbacks, setFeedbacks] = useState(null)
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true)
  const [errorFeedbacks, setErrorFeedbacks] = useState(null)

  useEffect(() => {
    if (!decoded.id) return

    const fetchUserWithId = async () => {
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
        setErrorUser(err.message)
      } finally {
        setUserLoading(false)
      }
    }

    fetchUserWithId()
  }, [decoded.id, token])

  useEffect(() => {
    if (!decoded.id) return

    const fetchFeedbacksByUserId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/feedbacks/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.status === 200 && response.data.length > 0) {
          setFeedbacks(response.data)
        } else {
          setErrorFeedbacks('No recent service feedback')
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setErrorFeedbacks('No recent service feedback')
        } else {
          setErrorFeedbacks('Error fetching feedbacks: ' + err.message)
        }
      } finally {
        setLoadingFeedbacks(false)
      }
    }

    fetchFeedbacksByUserId()
  }, [decoded.id, token])

  if (loadingUser || loadingFeedbacks) {
    return <div className='p-1 text-xs'>Loading...</div>
  }

  if (errorUser) {
    return <div>Error: {errorUser}</div>
  }

  // if (errorFeedbacks) {
  //   return <div>{errorFeedbacks}</div>
  // }

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

              <h1 className='text-2xl font-semibold'>
                {`${user?.firstName || ''} ${user?.lastName || ''}`}
              </h1>
              <h2 className='text-xs'>{`${user?.email || ''}`}</h2>

              <span className='text-[.6rem] absolute bottom-3 right-3 font-semibold bg-primary text-white py-1 px-3 rounded-full'>
                Created At:{' '}
                <span className='font-bold tracking-wider'>
                  {user?.createdAt}
                </span>
              </span>
            </div>
          </div>

          <div className='right'>
            <div className='box h-[370px] w-[600px] border shadow-xl rounded-lg '>
              <div className='flex justify-between'>
                <div className='h-40 w-full border m-3 rounded-lg  p-2'>
                  <div className='flex flex-col items-center '>
                    <p className='text-sm font-medium'>
                      Total Service Feedback
                    </p>

                    <span className='font-bold mt-5 text-4xl'>
                      {feedbacks?.length || 0}
                    </span>
                  </div>
                </div>

                <div className='h-40 w-full border m-3 rounded-lg  p-2'>
                  <div className='flex flex-col items-center '>
                    <p className='text-sm font-medium'>
                      Recent Service Feedback
                    </p>

                    <span className='font-bold mt-5 text-md text-center'>
                      {feedbacks?.length >= 1
                        ? feedbacks[0].serviceName
                        : 'No recent feedback'}
                    </span>
                  </div>
                </div>

                <div className='h-40 w-full border m-3 rounded-lg  p-2'>
                  <p className='text-sm font-medium'>Recent Login Date</p>
                </div>
              </div>
              <div className='h-40 w-[575px] border m-3 rounded-lg  p-2'>
                <p className='text-sm font-medium'>Account Overview</p>

                <div className='overflow-x-auto h-full w-full mt-3'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='bg-base-200 text-xs'>
                        <td>{`${user?.firstName} ${user?.lastName}`}</td>
                        <td>{`${user?.email}`}</td>
                        <td>
                          <span
                            className={
                              user?.isVerified
                                ? 'bg-green-600 text-white p-1 rounded font-semibold text-[.7rem]'
                                : 'bg-red-600 text-white p-1 rounded font-semibold text-[.7rem]'
                            }
                          >
                            {user?.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td>
                          <button className='btn btn-sm bg-primary hover:bg-primary-hover text-white text-xs'>
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
