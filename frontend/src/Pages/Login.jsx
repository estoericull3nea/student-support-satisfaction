import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import ucsLoginRegisterCover from '../assets/images/ucsLoginRegisterCover.jpg'
import ucsLogo from '../assets/images/logo/ucs_logo.png'
import Breadcrumbs from '../components/Breadcrumbs'

import { jwtDecode } from 'jwt-decode'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [isSendingVerification, setIsSendingVerification] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Get the `redirect` query parameter from the URL
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const redirectPath = queryParams.get('redirect') || '/'

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      const response = await axios.post(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/auth/login`,
        {
          email,
          password,
        }
      )

      const token = response.data.token
      let decodedToken
      if (token) {
        localStorage.setItem('token', token)
        decodedToken = jwtDecode(token)
        console.log(decodedToken)
      } else {
        localStorage.removeItem('token')
      }

      if (decodedToken.role === 'admin') {
        toast.success('Login successful!')
        navigate('/admin')
      } else {
        const queryParams = new URLSearchParams(window.location.search)
        const redirectUrl = queryParams.get('redirect') || '/'

        navigate(decodeURIComponent(redirectUrl))
        toast.success('Login successful!')
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message ===
          'Please verify your account before logging in.'
      ) {
        setModalVisible(true)
      } else {
        toast.error(error.response?.data?.message || 'Login failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendVerification = async () => {
    try {
      setIsSendingVerification(true)
      await axios.post(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/auth/resend-verification`,
        {
          email,
        }
      )
      toast.success('Verification email has been sent.')
      setIsSendingVerification(false)
      setModalVisible(false)
    } catch (error) {
      setIsSendingVerification(false)
      toast.error(error.response.data.message)
    }
  }

  return (
    <>
      <Navbar />

      <Breadcrumbs />

      <div>
        {/* Toaster container */}
        <div className='container flex items-center justify-center  xl:gap-x-10 xl:shadow-2xl shadow-none py-10 xl:py-20'>
          {/* Left */}
          <form
            className='max-w-[500px] p-5 xl:p-0 w-full'
            onSubmit={handleLogin}
          >
            {/* Top Text */}
            <div className='text-center'>
              <div className='flex items-center justify-center gap-x-2 w-full '>
                <img src={ucsLogo} alt='' className='w-14 ml-1 sm:ml-0' />
                <h1 className='font-bold text-xl text-primary '>
                  UCS | Student Support Service
                </h1>
              </div>
              <p className='my-3 text-primary font-semibold'>
                Login your account
              </p>
            </div>

            {/* Email Input */}
            <label className='form-control w-full '>
              <div className='label'>
                <span className='label-text'>
                  Email <span className='text-red-800'>*</span>
                </span>
              </div>
              <input
                type='text'
                className='input input-bordered input-md w-full '
                placeholder='Type here...'
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
              />
            </label>

            {/* Password Input */}
            <label className='form-control w-full '>
              <div className='label'>
                <span className='label-text'>
                  Password <span className='text-red-800'>*</span>
                </span>
              </div>
              <input
                type='password'
                className='input input-bordered input-md w-full'
                placeholder='Type here...'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className='flex justify-between mt-1 items-center'>
              <div>
                <span className='text-xs'>
                  Already have an account?{' '}
                  <Link
                    to='/register'
                    className='text-xs underline text-primary hover:text-primary-hover'
                  >
                    Sign Up
                  </Link>
                </span>
              </div>

              <Link to='/forgot-password' className='text-xs underline'>
                Forgot Password?
              </Link>
            </div>

            <button
              className='btn w-full bg-primary text-white hover:bg-primary-hover mt-4'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sign In...' : 'Sign In'}
            </button>
          </form>

          {/* Right */}
          <div className='max-w-[750px] xl:block hidden'>
            <img src={ucsLoginRegisterCover} alt='' />
          </div>
        </div>

        {/* Daisy UI Modal */}
        {modalVisible && (
          <div className='modal modal-open'>
            <div className='modal-box'>
              <h3 className='font-bold text-lg'>Email Verification Required</h3>
              <p className='py-4'>
                Please verify your email before logging in.
              </p>
              <div className='modal-action'>
                <button
                  className='btn bg-primary hover:bg-primary-hover text-white'
                  onClick={resendVerification}
                  disabled={isSendingVerification}
                >
                  {isSendingVerification
                    ? 'Sending...'
                    : 'Resend Verification Email'}
                </button>
                <button className='btn' onClick={() => setModalVisible(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Login
