import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import toast from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode' // Import the jwt-decode library

const Contact = () => {
  const [firstName, setFirstName] = useState('') // Store first name
  const [lastName, setLastName] = useState('') // Store last name
  const [email, setEmail] = useState('') // Store email
  const [message, setMessage] = useState('') // Store message
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false) // Store checkbox state

  useEffect(() => {
    const token = localStorage.getItem('token') // Get the token from localStorage

    if (token) {
      // Decode the JWT token to get user information
      const decodedToken = jwtDecode(token)

      setIsLoggedIn(true)

      // Assuming the JWT contains user info like firstName, lastName, and email
      setFirstName(decodedToken.firstName || '')
      setLastName(decodedToken.lastName || '')
      setEmail(decodedToken.email || '')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token') // Fetch the token inside handleSubmit

    if (!firstName || !lastName || !email || !message) {
      toast.error('Please fill in all fields.')
      return
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions.')
      return
    }

    let userId = null

    if (token) {
      // Decode the JWT token to get the userId
      const decodedToken = jwtDecode(token)
      userId = decodedToken?.id // Assuming the token has userId
    }

    try {
      // Submit the form data to the server
      await axios.post('http://localhost:5000/api/contacts', {
        firstName,
        lastName,
        email,
        message,
        userId, // Only include if userId is present
      })

      toast.success('Message sent successfully!')

      // Only clear the fields if the user is not logged in
      if (!userId) {
        setFirstName('') // Clear first name
        setLastName('') // Clear last name
        setEmail('') // Clear email
      }
      setMessage('') // Always clear the message field
      setTermsAccepted(false) // Reset terms checkbox
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    }
  }

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
            <p>We are here to serve! How can we help you?</p>
          </div>

          {/* Right */}
          <div className='w-full xl:max-w-[650px] shadow-2xl p-4 py-8 lg:px-10 rounded-lg'>
            <p className='text-sm mb-3'>
              Please contact us through this form and fill out all required
              fields.
            </p>
            <form className='space-y-3' onSubmit={handleSubmit}>
              {/* First Name & Last Name */}
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
                    placeholder='First Name'
                    value={firstName} // Pre-filled from JWT
                    onChange={(e) => setFirstName(e.target.value)}
                    readOnly={isLoggedIn}
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
                    placeholder='Last Name'
                    value={lastName} // Pre-filled from JWT
                    onChange={(e) => setLastName(e.target.value)}
                    readOnly={isLoggedIn}
                  />
                </label>
              </div>

              {/* Email */}
              <label className='form-control w-full'>
                <div className='label'>
                  <span className='label-text'>
                    Email <span className='text-red-800'>*</span>
                  </span>
                </div>
                <input
                  type='email'
                  className='input input-bordered input-md w-full'
                  placeholder='Email'
                  value={email} // Pre-filled from JWT
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={isLoggedIn}
                />
              </label>

              {/* Message */}
              <div className='space-y-2'>
                <h3>
                  Message <span className='text-red-700'>*</span>
                </h3>
                <textarea
                  className='textarea textarea-bordered w-full'
                  placeholder='Your message'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {/* Terms and Conditions */}
              <div className='form-control'>
                <label className='label cursor-pointer gap-x-2'>
                  <input
                    type='checkbox'
                    className='checkbox'
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span className='label-text text-sm'>
                    I accept the Terms and Conditions and Privacy Policy.
                    <span className='text-red-700'>*</span>
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
