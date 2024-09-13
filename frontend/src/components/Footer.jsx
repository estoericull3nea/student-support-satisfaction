import React from 'react'
import ucsLogo from '../assets/images/logo/ucs_logo.png'
import { services, links, legals } from '../constants/index'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <div className='bg-base-200'>
        <footer className='footer text-base-content p-10 container'>
          <aside>
            <div className='flex justify-center items-center gap-x-2'>
              <img src={ucsLogo} alt='' className='w-14 ml-1 sm:ml-0' />
              <h1 className='text-primary font-bold text-xl'>
                Student Support
              </h1>
            </div>

            <p>Urbiztondo Catholic School, INC.</p>
          </aside>
          <nav>
            <h6 className='font-bold text-primary'>Services</h6>

            {services &&
              services.map((data) => (
                <Link
                  className='link link-hover hover:text-primary '
                  to={data.link}
                  key={data.id}
                >
                  {data.serviceName}
                </Link>
              ))}
          </nav>
          <nav>
            <h6 className='font-bold text-primary '>Links</h6>

            {links &&
              links.map((link) => (
                <Link
                  className='link link-hover hover:text-primary'
                  key={link.id}
                  to={link.link}
                >
                  {link.linkName}
                </Link>
              ))}
          </nav>
          <nav>
            <h6 className='font-bold text-primary'>Legal</h6>

            {legals &&
              legals.map((legal) => (
                <Link
                  className='link link-hover hover:text-primary'
                  key={legal.id}
                  to={legal.link}
                >
                  {legal.legalName}
                </Link>
              ))}
          </nav>
        </footer>

        <div className='footer footer-center bg-base-300 text-base-content p-4'>
          <aside>
            <p>
              Copyright © {new Date().getFullYear()} - All right reserved by LEK
            </p>
          </aside>
        </div>
      </div>
    </>
  )
}

export default Footer
