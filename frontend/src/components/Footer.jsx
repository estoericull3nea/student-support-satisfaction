import React from 'react'
import ucsLogo from '../assets/images/logo/ucs_logo.png'
import { services, links, legals } from '../constants/index'

const Footer = () => {
  return (
    <>
      <div>
        <footer className='footer bg-base-200 text-base-content p-10'>
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
                <a
                  className='link link-hover hover:text-primary '
                  href={data.link}
                  key={data.id}
                >
                  {data.serviceName}
                </a>
              ))}
          </nav>
          <nav>
            <h6 className='font-bold text-primary '>Links</h6>

            {links &&
              links.map((link) => (
                <a className='link link-hover hover:text-primary' key={link.id}>
                  {link.linkName}
                </a>
              ))}
          </nav>
          <nav>
            <h6 className='font-bold text-primary'>Legal</h6>

            {legals &&
              legals.map((legal) => (
                <a
                  className='link link-hover hover:text-primary'
                  key={legal.id}
                  href={legal.link}
                >
                  {legal.legalName}
                </a>
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
