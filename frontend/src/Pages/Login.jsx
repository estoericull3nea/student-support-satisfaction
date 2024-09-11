import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast' // Import toaster

import ucsLoginRegisterCover from '../assets/images/ucsLoginRegisterCover.jpg'
import ucsLogo from '../assets/images/logo/ucs_logo.png'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Get the `redirect` query parameter from the URL
  const queryParams = new URLSearchParams(location.search)
  const redirectPath = queryParams.get('redirect') || '/' // Default to dashboard if no redirect

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password,
        }
      )

      // Save JWT token in localStorage
      localStorage.setItem('token', response.data.token)

      toast.success('Login successful!')
      // Navigate to the previous route or the dashboard after login
      navigate(redirectPath)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }
  return (
    <>
      <Navbar />

      <div>
        {/* Toaster container */}
        <div className='container flex items-center justify-center  xl:gap-x-10 xl:shadow-2xl shadow-none py-10 xl:py-20'>
          {/* Left */}
          <form className='max-w-[500px] p-5 xl:p-0' onSubmit={handleLogin}>
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
                type='email'
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

            <button className='btn w-full bg-primary text-white hover:bg-primary-hover mt-4'>
              Sign In
            </button>
            {error && <p>{error}</p>}
          </form>

          {/* Right */}
          <div className='max-w-[750px] xl:block hidden'>
            <img src={ucsLoginRegisterCover} alt='' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
