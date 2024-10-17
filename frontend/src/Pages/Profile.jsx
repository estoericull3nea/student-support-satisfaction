import React, { useEffect, useId, useState } from 'react'
import Navbar from '../components/Navbar'
import Breadcrumbs from '../components/Breadcrumbs'
import Footer from '../components/Footer'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { formatTime, isTokenValid } from '../utils'
import { debounce } from 'lodash'
import { FaCamera } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const token = localStorage.getItem('token')

  const navigate = useNavigate()

  useEffect(() => {
    if (!isTokenValid(token)) {
      localStorage.clear()
      toast.error('Please login again')
      navigate('/login')
    }
  }, [token, navigate])

  const decoded = token ? jwtDecode(token) : ''

  const [user, setUser] = useState(null)
  const [loadingUser, setUserLoading] = useState(true)
  const [errorUser, setErrorUser] = useState(null)

  const [currentPageLogin, setCurrentPageLogin] = useState(1)
  const [currentPageFeedback, setCurrentPageFeedback] = useState(1)
  const [itemsPerPage] = useState(10)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [profilePic, setProfilePic] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [fetchContacts, setFetchContacts] = useState([])

  useEffect(() => {
    if (!decoded.id) return

    const fetchUserWithId = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_BACKEND_URL}/api/users/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setUser(response.data)
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setEmail(response.data.email)
        setProfilePic(
          `${import.meta.env.VITE_PROD_BACKEND_URL}${response.data.profilePic}`
        )
      } catch (err) {
        setErrorUser(err.message)
      } finally {
        setUserLoading(false)
      }
    }

    fetchUserWithId()
  }, [decoded.id, token, firstName, lastName, email, profilePic])

  useEffect(() => {
    const fetchContactsQuery = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_BACKEND_URL}/api/contacts/users/${
            decoded.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setFetchContacts(response.data || [])
      } catch (error) {
        console.log(error)
      }
    }

    fetchContactsQuery()
  }, [])

  const debouncedSave = debounce(async (field, value) => {
    setIsSaving(true)

    try {
      await axios.put(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/users/${decoded.id}`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    } catch (err) {
      console.error('Error updating user:', err)
    } finally {
      setIsSaving(false)
    }
  }, 100)

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value)
    debouncedSave('firstName', e.target.value)
  }

  const handleLastNameChange = (e) => {
    setLastName(e.target.value)
    debouncedSave('lastName', e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    debouncedSave('email', e.target.value)
  }
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0]

    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    const formData = new FormData()
    formData.append('profilePic', file)

    try {
      setUploading(true)
      const response = await axios.put(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/users/${
          decoded.id
        }/upload-profile-pic`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setProfilePic(response.data.profilePic) // Update the profile picture state
    } catch (err) {
      console.error('Error uploading profile picture:', err)
    } finally {
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    document.getElementById('profilePicInput').click()
  }

  if (loadingUser) {
    return <div className='p-1 text-xs'>Loading...</div>
  }

  if (errorUser) {
    return <div>Error: {errorUser}</div>
  }

  // Pagination code
  const indexOfLastItemLogin = currentPageLogin * itemsPerPage
  const indexOfFirstItemLogin = indexOfLastItemLogin - itemsPerPage
  const currentLoginItems =
    user?.lastLoginDate?.slice(indexOfFirstItemLogin, indexOfLastItemLogin) ||
    []

  const totalPagesLogin = Math.ceil(
    (user?.lastLoginDate?.length || 0) / itemsPerPage
  )

  const handlePageChangeLogin = (pageNumber) => {
    setCurrentPageLogin(pageNumber)
  }

  const handlePrevPageLogin = () => {
    if (currentPageLogin > 1) {
      setCurrentPageLogin(currentPageLogin - 1)
    }
  }

  const handleNextPageLogin = () => {
    if (currentPageLogin < totalPagesLogin) {
      setCurrentPageLogin(currentPageLogin + 1)
    }
  }

  const indexOfLastItemFeedback = currentPageFeedback * itemsPerPage
  const indexOfFirstItemFeedback = indexOfLastItemFeedback - itemsPerPage
  const currentFeedbackItems =
    user?.feedbacks?.slice(indexOfFirstItemFeedback, indexOfLastItemFeedback) ||
    []

  const totalPagesFeedback = Math.ceil(
    (user?.feedbacks?.length || 0) / itemsPerPage
  )

  const handlePageChangeFeedback = (pageNumber) => {
    setCurrentPageFeedback(pageNumber)
  }

  const handlePrevPageFeedback = () => {
    if (currentPageFeedback > 1) {
      setCurrentPageFeedback(currentPageFeedback - 1)
    }
  }

  const handleNextPageFeedback = () => {
    if (currentPageFeedback < totalPagesFeedback) {
      setCurrentPageFeedback(currentPageFeedback + 1)
    }
  }

  return (
    <>
      <Navbar />
      <Breadcrumbs />

      <div className='container'>
        <div className='my-10 flex flex-wrap justify-center gap-3'>
          {/* Left Section */}
          <div className='left w-full lg:w-auto'>
            <div className='box h-[300px] w-full lg:w-[350px] border shadow-lg rounded-lg flex flex-col justify-center items-center gap-y-2 relative'>
              <div className='avatar relative'>
                <div
                  className='w-24 rounded-full cursor-pointer relative group'
                  onClick={triggerFileInput}
                >
                  {profilePic === `${import.meta.env.VITE_PROD_BACKEND_URL}` ? (
                    <div className='avatar placeholder w-full'>
                      <div className='bg-neutral text-neutral-content w-full rounded-full'>
                        <span className='font-bold tracking-tighter text-center text-3xl'>
                          {`${user?.firstName[0].toUpperCase()} ${user?.lastName[0].toUpperCase()}`}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={profilePic}
                      alt='Profile'
                      className='w-full h-full rounded-full'
                    />
                  )}

                  {/* Hidden file input */}
                  <input
                    type='file'
                    id='profilePicInput'
                    accept='image/png, image/jpeg'
                    style={{ display: 'none' }}
                    onChange={handleProfilePicChange}
                  />

                  {/* Overlay for hover animation with icon */}
                  <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full'>
                    <FaCamera className='text-2xl mb-2' />
                  </div>
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

          <div className='right w-full lg:w-auto'>
            <div className='box h-auto  w-full lg:w-[600px] border shadow-xl rounded-lg p-3 space-y-3 lg:space-y-3'>
              <div className='flex flex-col lg:flex-row justify-between space-y-3 lg:space-y-0 lg:space-x-3'>
                <div className='h-40 w-full lg:w-auto border rounded-lg p-2'>
                  <div className='flex flex-col items-center'>
                    <p className='text-sm font-medium'>
                      Total Service Feedback
                    </p>
                    <span className='font-bold mt-5 text-4xl'>
                      {user.feedbacks.length}
                    </span>
                  </div>
                </div>

                <div className='h-40 w-full lg:w-auto border rounded-lg p-2'>
                  <div className='flex flex-col items-center'>
                    <p className='text-sm font-medium'>
                      Recent Service Feedback
                    </p>
                    <span className='font-bold mt-5 text-md text-center'>
                      {user.feedbacks.length
                        ? user.feedbacks[user.feedbacks.length - 1].serviceName
                        : 'No Recent Feedback'}
                    </span>
                  </div>
                </div>

                <div className='h-40 w-full lg:w-auto border rounded-lg p-2'>
                  <div className='flex flex-col items-center'>
                    <p className='text-sm font-medium'>Recent Login Date</p>
                    <span className='font-bold mt-5 text-sm text-center'>
                      {user.lastLoginDate[0].loginTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className='h-40 w-full border rounded-lg p-2'>
                <p className='text-sm font-medium'>Account Overview</p>

                <div className='overflow-x-auto h-full w-full mt-3'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Status</th>
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
          className='tabs tabs-lifted max-w-full lg:max-w-[800px] mx-auto mb-10 mt-20'
        >
          <input
            type='radio'
            name='my_tabs_2'
            role='tab'
            className='tab'
            aria-label='Account Settings'
          />
          <div
            role='tabpanel'
            className='tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-hidden'
          >
            <div>
              <div className='flex flex-col md:flex-row gap-3'>
                {/* First Name */}
                <label className='form-control w-full'>
                  <div className='label'>
                    <span className='label-text'>
                      First Name <span className='text-red-800'>*</span>
                    </span>
                  </div>
                  <input
                    type='text'
                    className='input input-bordered input-md w-full'
                    value={firstName}
                    onChange={handleFirstNameChange}
                  />
                </label>

                {/* Last Name */}
                <label className='form-control w-full'>
                  <div className='label'>
                    <span className='label-text'>
                      Last Name <span className='text-red-800'>*</span>
                    </span>
                  </div>
                  <input
                    type='text'
                    className='input input-bordered input-md w-full'
                    value={lastName}
                    onChange={handleLastNameChange}
                  />
                </label>
              </div>

              {/* Email Input */}
              <label className='form-control w-full mt-4'>
                <div className='label'>
                  <span className='label-text'>
                    Email <span className='text-red-800'>*</span>
                  </span>
                </div>
                <input
                  type='email'
                  className='input input-bordered input-md w-full'
                  value={email}
                  onChange={handleEmailChange}
                />
              </label>

              {/* Saving Indicator */}
              {isSaving && (
                <div className='flex justify-end mt-2'>
                  <button className='btn btn-sm btn-outline loading'>
                    Saving...
                  </button>
                </div>
              )}
            </div>
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
            className='tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-hidden'
          >
            <div className='overflow-x-auto'>
              <table className='table w-full'>
                <thead>
                  <tr className='text-center'>
                    <th>Service Name</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Commented At</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFeedbackItems.map((data, index) => (
                    <tr key={index} className='text-xs text-center'>
                      <td>{data.serviceName}</td>
                      <td>{data.rating}</td>
                      <td>{data.comment}</td>
                      <td>{formatTime(data.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Feedback History Pagination Controls */}
            <div className='flex justify-center mt-4'>
              <div className='btn-group space-x-2'>
                <button
                  className={`btn btn-xs ${
                    currentPageFeedback === 1 ? 'btn-disabled' : ''
                  }`}
                  onClick={handlePrevPageFeedback}
                  disabled={currentPageFeedback === 1}
                >
                  « Prev
                </button>

                {Array.from({ length: totalPagesFeedback }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`btn btn-xs ${
                      currentPageFeedback === i + 1 ? 'btn-active' : ''
                    }`}
                    onClick={() => handlePageChangeFeedback(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className={`btn btn-xs ${
                    currentPageFeedback === totalPagesFeedback
                      ? 'btn-disabled'
                      : ''
                  }`}
                  onClick={handleNextPageFeedback}
                  disabled={currentPageFeedback === totalPagesFeedback}
                >
                  Next »
                </button>
              </div>
            </div>
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
            className='tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-hidden'
          >
            <div className='overflow-x-auto'>
              <table className='table w-full'>
                <thead>
                  <tr className='text-center'>
                    <th>IP Address</th>
                    <th>Login Date & Time</th>
                    <th>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLoginItems.map((data, index) => (
                    <tr key={index} className='text-xs text-center'>
                      <td>{data.ipAddress}</td>
                      <td>{data.loginTime}</td>
                      <td className='max-w-[200px]'>{data.userAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Login History Pagination Controls */}
            <div className='flex justify-center mt-4'>
              <div className='btn-group space-x-2'>
                <button
                  className={`btn btn-xs ${
                    currentPageLogin === 1 ? 'btn-disabled' : ''
                  }`}
                  onClick={handlePrevPageLogin}
                  disabled={currentPageLogin === 1}
                >
                  « Prev
                </button>

                {Array.from({ length: totalPagesLogin }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`btn btn-xs ${
                      currentPageLogin === i + 1 ? 'btn-active' : ''
                    }`}
                    onClick={() => handlePageChangeLogin(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className={`btn btn-xs ${
                    currentPageLogin === totalPagesLogin ? 'btn-disabled' : ''
                  }`}
                  onClick={handleNextPageLogin}
                  disabled={currentPageLogin === totalPagesLogin}
                >
                  Next »
                </button>
              </div>
            </div>
          </div>

          {/* new tab */}

          <input
            type='radio'
            name='my_tabs_2'
            role='tab'
            className='tab'
            aria-label='Queries History'
          />

          <div
            role='tabpanel'
            className='tab-content bg-base-100 border-base-300 rounded-box p-6 overflow-hidden'
          >
            <div className='overflow-x-auto'>
              <table className='table w-full'>
                <thead>
                  <tr className='text-center'>
                    <th>Message</th>
                    <th>Message At</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchContacts.map((data, index) => (
                    <tr key={index} className='text-xs text-center'>
                      <td>{data.message}</td>
                      <td>{formatTime(data.createdAt)}</td>
                      {/* <td className='max-w-[200px]'>{data.userAgent}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* <div className='flex justify-center mt-4'>
              <div className='btn-group space-x-2'>
                <button
                  className={`btn btn-xs ${
                    currentPageLogin === 1 ? 'btn-disabled' : ''
                  }`}
                  onClick={handlePrevPageLogin}
                  disabled={currentPageLogin === 1}
                >
                  « Prev
                </button>

                {Array.from({ length: totalPagesLogin }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`btn btn-xs ${
                      currentPageLogin === i + 1 ? 'btn-active' : ''
                    }`}
                    onClick={() => handlePageChangeLogin(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className={`btn btn-xs ${
                    currentPageLogin === totalPagesLogin ? 'btn-disabled' : ''
                  }`}
                  onClick={handleNextPageLogin}
                  disabled={currentPageLogin === totalPagesLogin}
                >
                  Next »
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Profile
