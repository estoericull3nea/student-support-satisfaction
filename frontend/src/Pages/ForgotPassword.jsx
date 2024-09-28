import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ucsLoginRegisterCover from '../assets/images/ucsLoginRegisterCover.jpg'
import ucsLogo from '../assets/images/logo/ucs_logo.png'
import { TiArrowLeft } from 'react-icons/ti'
import Breadcrumbs from '../components/Breadcrumbs'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isSendingVerification, setIsSendingVerification] = useState(false)

  const navigate = useNavigate()

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
        { email }
      )

      toast.success('Password reset link has been sent to your email!')
      navigate('/login')
    } catch (error) {
      if (
        error.response &&
        error.response.data.message ===
          'Your account is not verified. Please verify your account first'
      ) {
        // Show the modal if verification is needed
        setModalVisible(true)
      } else {
        toast.error(error.response.data.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    try {
      setIsSendingVerification(true)
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-verification`,
        {
          email,
        }
      )
      toast.success('Verification email has been sent.')
      setIsSendingVerification(false)
      setModalVisible(false)
    } catch (error) {
      setIsSendingVerification(false)
      console.error('Error resending verification', error.response.data.message)
    }
  }

  return (
    <>
      <Navbar />

      <Breadcrumbs />

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
        {/* Daisy UI Modal */}
        {modalVisible && (
          <div className='modal modal-open'>
            <div className='modal-box'>
              <h3 className='font-bold text-lg'>Email Verification Required</h3>
              <p className='py-4'>
                Your account is not verified. Please verify your account or
                click "
                <span className='font-semibold'>Resend Verification Email</span>
                " to resend the verification email.
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

export default ForgotPassword
