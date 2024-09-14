import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ucsLogo from '../assets/images/logo/ucs_logo.png'
import { services } from '../constants/index'
import toast from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'

const Navbar = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const decoded = token ? jwtDecode(token) : ''

  const handleLogout = () => {
    localStorage.clear()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <div className='container z-10 '>
      <div className='navbar bg-base-100'>
        <div className='navbar-start'>
          {/* DropDown */}
          <div className='dropdown'>
            <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
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

        {/* Sign Up and Sign In/Logout */}
        <div className='navbar-end space-x-2'>
          {/* Only show Sign Up if the user is not logged in */}
          {!token && (
            <Link to='/register'>
              <button className='btn text-xs px-[.5rem] md:px-[1rem] bg-primary hover:bg-primary-hover text-white'>
                Sign Up
              </button>
            </Link>
          )}

          {/* Conditionally render "Sign In" or "Logout" based on token existence */}
          {token ? (
            <div className='space-x-3'>
              <button
                onClick={handleLogout}
                className='btn text-xs primary-btn-outline px-[.5rem] md:px-[1rem]'
              >
                Logout
              </button>

              <div className='avatar placeholder'>
                <div className='bg-neutral text-neutral-content w-11 rounded-full'>
                  <span className='font-bold tracking-tighter text-center'>
                    {`${decoded.firstName[0].toUpperCase()} ${decoded.lastName[0].toUpperCase()}`}
                  </span>
                </div>
              </div>
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
