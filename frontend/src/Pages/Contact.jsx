import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import ucsHeroPageTemp from '../assets/images/ucsHeroPageTemp.png'

import { FaFacebook } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

const Contact = () => {
  return (
    <>
      <Navbar />
      <div>
        <div className='container grid grid-cols-1 xl:grid-cols-2 items-center min-h-[calc(100vh-100px)] my-5 '>
          {/* Left */}
          <div className='w-full xl:max-w-[400px] py-10 xl:p-0 space-y-3'>
            <span className='text-[.8rem]'>Contact Us</span>
            <h1 className='font-bold text-5xl tracking-wider text-primary'>
              GET IN TOUCH
            </h1>
            <p>We are awards and we are here to serve! How can we help you?</p>
            <div className='socials flex items-center gap-x-3'>
              <a
                href='https://www.facebook.com/ucsaldcs'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaFacebook className='text-2xl text-primary' />
              </a>
              <a href='mailto:urbiztondocatholicschool@gmail.com'>
                <MdEmail className='text-3xl text-primary' />
              </a>
            </div>
          </div>

          {/* Right */}
          <div className='w-full xl:max-w-[650px] shadow-2xl p-4 py-8 lg:px-10 rounded-lg'>
            <p className='text-sm mb-3'>
              If you have any questions, please contact us through this form
              please complete the follow fields
            </p>
            <form className='space-y-3'>
              {/* Fname & Lname Input */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-3'>
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

              {/* Comment */}
              <div className='space-y-2'>
                <h3>
                  Message <span className='text-red-700'>*</span>
                </h3>

                <textarea
                  className='textarea textarea-bordered w-full'
                  placeholder='Type here'
                ></textarea>
              </div>

              <div className='form-control'>
                <label className='label cursor-pointer gap-x-2'>
                  <input type='checkbox' defaultChecked className='checkbox' />
                  <span className='label-text text-sm'>
                    I have read and accepted the Terms and Conditions and
                    Privacy Policy.
                  </span>
                </label>
              </div>

              <div className='text-end'>
                <button className='btn bg-primary hover:bg-primary-hover text-white'>
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Contact
