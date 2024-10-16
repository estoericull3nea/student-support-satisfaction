import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ucsLoginRegisterCover from '../assets/images/ucsLoginRegisterCover.jpg'
import ucsLogo from '../assets/images/logo/ucs_logo.png'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Breadcrumbs from '../components/Breadcrumbs'

const Register = () => {
  const SERVER_URL = `${import.meta.env.VITE_DEV_BACKEND_URL}/api`

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!isValidEmail(formData.email)) {
      toast.error('Invalid email address')
      return
    }

    try {
      setIsLoading(true)

      const response = await axios.post(`${SERVER_URL}/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })

      toast.success(
        `Registration successful! Please check your email to verify your account.`
      )

      navigate('/login')

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <Breadcrumbs />

      <div>
        <div className='container flex items-center justify-center xl:gap-x-10 xl:shadow-2xl shadow-none py-10 xl:py-20'>
          <form
            className='max-w-[500px] p-5 xl:p-0 w-full'
            onSubmit={handleSubmit}
          >
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </label>
            </div>

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
                disabled={isLoading}
              />
            </label>

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
                disabled={isLoading}
              />
            </label>

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
                disabled={isLoading}
              />
            </label>

            <div className='text-end flex gap-x-1 justify-end mt-1'>
              <span className='text-xs'>Have an account?</span>
              <Link
                to='/login'
                className='text-xs underline text-primary hover:text-primary-hover'
              >
                Sign In
              </Link>
            </div>

            <button
              type='submit'
              className='btn w-full bg-primary text-white hover:bg-primary-hover mt-4'
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>

          <div className='max-w-[750px] xl:block hidden'>
            <img src={ucsLoginRegisterCover} alt='UCS Login/Register Cover' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
