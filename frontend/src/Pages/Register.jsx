import React from 'react'
import Navbar from '../components/Navbar'

import ucsLoginRegisterCover from '../assets/images/ucsLoginRegisterCover.jpg'
import ucsLogo from '../assets/images/logo/ucs_logo.png'

const Register = () => {
  return (
    <>
      <Navbar />

      <div>
        <div className='container flex items-center justify-center  xl:gap-x-10 xl:shadow-2xl shadow-none py-10 xl:py-20'>
          {/* Left */}
          <form className='max-w-[500px] p-5 xl:p-0'>
            {/* Top Text */}
            <div className='text-center'>
              <div className='flex items-center justify-center gap-x-2 w-full '>
                <img src={ucsLogo} alt='' className='w-14 ml-1 sm:ml-0' />
                <h1 className='font-bold text-xl text-primary '>
                  UCS | Student Support Service
                </h1>
              </div>
              <p className='my-3 text-primary font-semibold'>
                Register your account
              </p>
            </div>

            {/* Fname & Lname Input */}
            <div className='flex space-x-2'>
              <label className='form-control w-full'>
                <div className='label'>
                  <span className='label-text'>
                    First Name <span className='text-red-800'>*</span>
                  </span>
                </div>
                <input
                  type='text'
                  className='input input-bordered input-md w-full'
                  placeholder='Type here...'
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
                  className='input input-bordered input-md w-full'
                  placeholder='Type here...'
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
                className='input input-bordered input-md w-full '
                placeholder='Type here...'
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
                className='input input-bordered input-md w-full '
                placeholder='Type here...'
              />
            </label>

            <button className='btn w-full bg-primary text-white hover:bg-primary-hover mt-4'>
              Sign Up
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

export default Register
