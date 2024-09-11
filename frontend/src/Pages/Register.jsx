import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ucsLoginRegisterCover from '../assets/images/ucsLoginRegisterCover.jpg'
import ucsLogo from '../assets/images/logo/ucs_logo.png'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Register = () => {
  const SERVER_URL = `http://localhost:5000/api`

  // State to hold form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // State to hold the message and showToast for transitions
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Function to handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      // Set loading state to true when submission starts
      setIsLoading(true)

      // Make a POST request to the backend
      const response = await axios.post(`${SERVER_URL}/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })

      // Handle success response
      toast.success(
        `Registration successful! Please check your email to verify your account.`
      )

      // Clear form fields after successful request
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      // Handle error response
      if (error.response) {
        toast.error(
          error.response.data.message ||
            'Something Went Wrong, Please try again later'
        )
      } else {
        toast.error('Server error, please try again later.')
      }
    } finally {
      // Set loading state to false after the request is done
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div>
        <div className='container flex items-center justify-center xl:gap-x-10 xl:shadow-2xl shadow-none py-10 xl:py-20'>
          {/* Left */}
          <form className='max-w-[500px] p-5 xl:p-0' onSubmit={handleSubmit}>
            {/* Top Text */}
            <div className='text-center'>
              <div className='flex flex-col items-center gap-2 md:flex-row justify-center'>
                <img
                  src={ucsLogo}
                  alt='UCS Logo'
                  className='w-14 ml-1 sm:ml-0'
                />
                <h1 className='font-bold text-xl text-primary '>
                  UCS | Student Support Service
                </h1>
              </div>
              <p className='my-3 text-primary font-semibold'>
                Register your account
              </p>
            </div>

            {/* Fname & Lname Input */}
            <div className='flex flex-col md:flex-row md:gap-x-3'>
              <label className='form-control w-full'>
                <div className='label'>
                  <span className='label-text'>
                    First Name <span className='text-red-800'>*</span>
                  </span>
                </div>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  className='input input-bordered input-md w-full'
                  placeholder='Type here...'
                  required
                />
              </label>

              <label className='form-control w-full'>
                <div className='label'>
                  <span className='label-text'>
                    Last Name <span className='text-red-800'>*</span>
                  </span>
                </div>
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  className='input input-bordered input-md w-full'
                  placeholder='Type here...'
                  required
                />
              </label>
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
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='input input-bordered input-md w-full'
                placeholder='Type here...'
                required
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
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='input input-bordered input-md w-full'
                placeholder='Type here...'
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
                value={formData.confirmPassword}
                onChange={handleChange}
                className='input input-bordered input-md w-full'
                placeholder='Type here...'
                required
              />
            </label>

            {/* <div className='text-end'>
              <span className='text-xs'>Have an account?</span>
              <Link to='/login' className='text-xs underline'>
                Sign In
              </Link>
            </div> */}

            <div className='text-end flex gap-x-1 justify-end mt-1'>
              <span className='text-xs'>Have an account?</span>
              <Link
                to='/login'
                className='text-xs underline text-primary hover:text-primary-hover'
              >
                Sign In
              </Link>
            </div>

            {/* Loading spinner or Register button */}
            <button
              type='submit'
              className='btn w-full bg-primary text-white hover:bg-primary-hover mt-4'
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? 'Loading...' : 'Sign Up'} {/* Show loading text */}
            </button>
          </form>

          {/* Right */}
          <div className='max-w-[750px] xl:block hidden'>
            <img src={ucsLoginRegisterCover} alt='UCS Login/Register Cover' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
