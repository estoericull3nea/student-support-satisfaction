import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const VerifyEmail = () => {
  const SERVER_URL = `http://localhost:5000`
  const [message, setMessage] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [countdown, setCountdown] = useState(8)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Extract the token from the URL query string
    const params = new URLSearchParams(location.search)
    const token = params.get('token')

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/api/auth/verify?token=${token}`
        )
        setMessage('Email verified successfully. You can now log in.')
        setIsVerified(true)

        // Start the countdown
        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(countdownInterval)
              navigate('/login')
            }
            return prevCountdown - 1
          })
        }, 1000)

        // Cleanup interval when component unmounts
        return () => clearInterval(countdownInterval)
      } catch (error) {
        setMessage('Invalid or expired token. Please try again.')
        setIsVerified(false)
      }
    }

    if (token) {
      verifyEmail()
    }
  }, [location, navigate])

  return (
    <div className='flex items-center justify-center mt-[4rem] px-[1rem]'>
      <div className='max-w-lg mx-auto text-center'>
        <h1
          className={`text-3xl font-bold mb-4 ${
            isVerified ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isVerified
            ? 'Email Verified Successfully'
            : 'Email Verification Failed'}
        </h1>

        {/* Message body */}
        <p className='text-lg text-gray-700 mb-6'>{message}</p>

        <div
          className={`alert ${
            isVerified ? 'alert-success' : 'alert-error'
          } shadow-lg`}
        >
          <div className='flex flex-col items-center justify-center w-full'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='stroke-current flex-shrink-0 h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d={isVerified ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}
              />
            </svg>
            <span className='w-full text-center'>
              {isVerified
                ? 'Your email has been successfully verified! You can now log in.'
                : 'Failed to verify your email. Please try again.'}
            </span>
          </div>
        </div>

        {/* Button and Countdown */}
        {isVerified && (
          <div className='flex justify-center items-center mt-6'>
            <button
              onClick={() => navigate('/login')}
              className='btn bg-primary hover:bg-primary-hover text-white'
            >
              Go to Login
            </button>
            {countdown > 0 && (
              <span className='ml-4 text-gray-500'>{countdown} seconds...</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
