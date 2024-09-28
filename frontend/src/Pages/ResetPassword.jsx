import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { TiArrowLeft } from 'react-icons/ti'
import ucsLoginRegisterCover from '../assets/images/ucsLoginRegisterCover.jpg'
import ucsLogo from '../assets/images/logo/ucs_logo.png'
import Breadcrumbs from '../components/Breadcrumbs'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { resetToken } = useParams()

  const handleResetPassword = async (e) => {
    e.preventDefault()

    // Check if passwords match before making the API request
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setIsLoading(true)

      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/auth/reset-password/${resetToken}`,
        { password }
      )

      console.log(response)

      toast.success('Password has been reset successfully!')
      navigate('/login')
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to reset password'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <Breadcrumbs />

      <div>
        {/* Toaster container */}
        <div className='container flex items-center justify-center xl:gap-x-10 xl:shadow-2xl shadow-none py-10 xl:py-20'>
          {/* Left */}
          <form
            className='max-w-[500px] p-5 xl:p-0'
            onSubmit={handleResetPassword}
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
                Reset Your Password
              </p>
            </div>

            {/* Password Input */}
            <label className='form-control w-full '>
              <div className='label'>
                <span className='label-text'>
                  Password <span className='text-red-800'>*</span>
                </span>
              </div>
              <input
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input input-bordered input-md w-full'
                placeholder='Type your new password...'
                required
              />
            </label>

            {/* Confirm Password Input */}
            <label className='form-control w-full '>
              <div className='label'>
                <span className='label-text'>
                  Confirm Password <span className='text-red-800'>*</span>
                </span>
              </div>
              <input
                type='password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='input input-bordered input-md w-full'
                placeholder='Confirm your new password...'
                required
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
              {isLoading ? 'Loading...' : 'Reset Password'}{' '}
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

export default ResetPassword
