import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import ucsLoginRegisterCover from '../assets/images/ucsLoginRegisterCover.jpg'
import ucsLogo from '../assets/images/logo/ucs_logo.png'

import { TiArrowLeft } from 'react-icons/ti'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const response = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email }
      )

      toast.success('Password reset link has been sent to your email!')
      navigate('/login')
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Request for password reset failed'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div>
        <div className='container flex items-center justify-center xl:gap-x-10 xl:shadow-2xl shadow-none py-10 xl:py-20'>
          {/* Left */}
          <form
            className='max-w-[500px] p-5 xl:p-0'
            onSubmit={handleForgotPassword}
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
                Forgot Your Password
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
                className='input input-bordered input-md w-full'
                placeholder='Type here...'
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
              />
            </label>

            <Link
              to='/login'
              className='text-xs underline flex items-center justify-end mt-1'
            >
              <TiArrowLeft className='text-lg' />
              <span> Back to Sign In</span>
            </Link>

            {/* Submit Button */}
            <button
              type='submit'
              className='btn w-full bg-primary text-white hover:bg-primary-hover mt-4'
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Forgot Password'}{' '}
            </button>
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

export default ForgotPassword
