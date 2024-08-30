import React from 'react'
import heroImage from '../assets/images/heroSection.jpg'

const Hero = () => {
  const heroSection = {
    height: 'calc(100vh - 72px)',
  }
  return (
    <>
      <div className='hero bg-base-200 h-full py-14 sm:px-0 sm:p-20 '>
        <div className='container'>
          <div className='flex justify-between items-center gap-x-5'>
            <div className='left max-w-[500px] space-y-5'>
              <h1 className='font-bold text-4xl sm:text-5xl sm:leading-tight'>
                Welcome to the{' '}
                <span className='text-primary'>Student Support Service</span>{' '}
                Satisfaction System
              </h1>
              <p>
                Empowering students to provide feedback and improve the support
                services offered by our school.
              </p>
              <a
                href='#'
                className='btn bg-primary hover:bg-primary-hover text-white'
              >
                Explore Our Services
              </a>
            </div>

            <div className='right max-w-[550px]'>
              <img
                src={heroImage}
                alt=''
                className='w-full rounded-lg hidden lg:block h-[350px]'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
