import React from 'react'
import { services } from '../constants/index'

// logo
import ucsLogo from '../assets/images/logo/ucs_logo.png'

import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='container z-10 '>
      <div className=' navbar bg-base-100'>
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
              <li>
                <a className='hover:bg-primary hover:text-white'>Home</a>
              </li>
              <li>
                <a className='hover:bg-primary hover:text-white'>Services</a>
                <ul className='p-2 '>
                  {services &&
                    services.map((data) => (
                      <li key={data.id}>
                        <a
                          href={data.link}
                          className='hover:bg-primary hover:text-white'
                        >
                          {data.serviceName}
                        </a>
                      </li>
                    ))}
                </ul>
              </li>
              <li>
                <a className='hover:bg-primary hover:text-white'>About</a>
              </li>
              <li>
                <a className='hover:bg-primary hover:text-white'>Contact</a>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <a href='/' className='flex items-center gap-x-2 w-full sm:w-max'>
            <img src={ucsLogo} alt='' className='w-14 ml-1 sm:ml-0' />
            <h1 className='font-medium text-xl hidden sm:block'>
              Student Support
            </h1>
          </a>
        </div>

        {/* Links */}
        <div className='navbar-center hidden lg:flex'>
          <ul className='menu menu-horizontal px-1'>
            <li>
              <a className='hover:bg-primary hover:text-white'>Home</a>
            </li>
            <li>
              <details>
                <summary className='hover:bg-primary hover:text-white'>
                  Services
                </summary>
                <ul className='p-2 w-max'>
                  {services &&
                    services.map((data) => (
                      <li key={data.id}>
                        <a
                          href={data.link}
                          className='hover:bg-primary hover:text-white'
                        >
                          {data.serviceName}
                        </a>
                      </li>
                    ))}
                </ul>
              </details>
            </li>
            <li>
              <a className='hover:bg-primary hover:text-white'>About</a>
            </li>
            <li>
              <a className='hover:bg-primary hover:text-white'>Contact</a>
            </li>
          </ul>
        </div>

        {/* Sign Up */}
        <div className='navbar-end space-x-2'>
          <Link to='/register'>
            <button className='btn bg-primary hover:bg-primary-hover text-white'>
              Sign Up
            </button>
          </Link>

          <Link to='/login'>
            <button className='btn primary-btn-outline'>Sign In</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
