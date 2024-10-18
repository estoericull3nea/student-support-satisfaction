import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ucsLogo from '../assets/images/logo/ucs_logo.png'
import { services } from '../constants/index'
import toast from 'react-hot-toast'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { isTokenValid } from '../utils'

const Navbar = () => {
  const token = localStorage.getItem('token')

  const navigate = useNavigate()
  const currentTime = Date.now() / 1000

  const decoded = token ? jwtDecode(token) : ''

  const userId = decoded?.id

  const [user, setUser] = useState({})

  console.log()

  const handleLogout = () => {
    localStorage.clear()
    toast.success('Logged out')
    navigate('/login')
  }

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_BACKEND_URL}/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setUser(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchActiveUsers()
  }, [])

  return (
    <div className='container z-10 '>
      <div className='navbar bg-base-100 '>
        <div className='navbar-start'>
          {/* DropDown */}
          <div className='dropdown'>
            <div tabIndex={0} role='button' className='pr-3 lg:hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h8m-8 6h16'
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-5 w-max p-2 shadow'
            >
              <Link to='/'>
                <li>
                  <button className='hover:bg-primary hover:text-white'>
                    Home
                  </button>
                </li>
              </Link>
              <li>
                <a className='hover:bg-primary hover:text-white'>Services</a>
                <ul className='p-2 '>
                  {services &&
                    services.map((data) => (
                      <li key={data.id}>
                        <Link
                          to={data.link}
                          className='hover:bg-primary hover:text-white'
                        >
                          {data.serviceName}
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>
              <Link to='/about-us'>
                <li>
                  <button className='hover:bg-primary hover:text-white'>
                    About
                  </button>
                </li>
              </Link>
              <Link to='/contact-us'>
                <li>
                  <button className='hover:bg-primary hover:text-white'>
                    Contact
                  </button>
                </li>
              </Link>
            </ul>
          </div>

          {/* Logo */}
          <Link to='/'>
            <button className='flex items-center gap-x-2 w-full sm:w-max'>
              <img src={ucsLogo} alt='' className='w-14 ml-1 sm:ml-0' />
              <h1 className='font-bold text-primary text-xl hidden sm:block'>
                Student Support
              </h1>
            </button>
          </Link>
        </div>

        {/* Links */}
        <div className='navbar-center hidden lg:flex'>
          <ul className='menu menu-horizontal px-1'>
            <Link to='/'>
              <li>
                <button className='hover:bg-primary hover:text-white'>
                  Home
                </button>
              </li>
            </Link>
            <li>
              <details>
                <summary className='hover:bg-primary hover:text-white'>
                  Services
                </summary>
                <ul className='p-2 w-max'>
                  {services &&
                    services.map((data) => (
                      <li key={data.id}>
                        <Link
                          to={data.link}
                          className='hover:bg-primary hover:text-white'
                        >
                          {data.serviceName}
                        </Link>
                      </li>
                    ))}
                </ul>
              </details>
            </li>
            <Link to='/about-us'>
              <li>
                <button className='hover:bg-primary hover:text-white'>
                  About
                </button>
              </li>
            </Link>
            <Link to='/contact-us'>
              <li>
                <button className='hover:bg-primary hover:text-white'>
                  Contact
                </button>
              </li>
            </Link>
          </ul>
        </div>

        <div className='navbar-end space-x-2'>
          {token && decoded.exp < currentTime ? (
            <Link to='/register'>
              <button className='btn text-xs px-[.5rem] md:px-[1rem] bg-primary hover:bg-primary-hover text-white'>
                Sign Up
              </button>
            </Link>
          ) : null}

          {token && decoded?.exp > currentTime ? (
            <div className='space-x-3 flex items-center'>
              <button
                onClick={handleLogout}
                className='btn text-xs primary-btn-outline px-[.5rem] md:px-[1rem]'
              >
                Logout
              </button>

              {user?.profilePic ? (
                <Link to='/profile'>
                  <div className='avatar placeholder'>
                    <div className='bg-neutral text-neutral-content w-11 rounded-full'>
                      <img
                        src={`${import.meta.env.VITE_PROD_BACKEND_URL}${
                          user.profilePic
                        }`}
                        alt='User Avatar'
                        className='rounded-full'
                      />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className='avatar placeholder'>
                  <div className='bg-neutral text-neutral-content w-11 rounded-full'>
                    <span className='font-bold tracking-tighter text-center text-sm'>
                      {decoded?.firstName && decoded?.lastName
                        ? `${decoded.firstName[0].toUpperCase()} ${decoded.lastName[0].toUpperCase()}`
                        : '?'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to='/login'>
              <button className='btn text-xs primary-btn-outline px-[.5rem] md:px-[1rem]'>
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
