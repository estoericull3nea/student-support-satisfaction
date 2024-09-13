import React from 'react'

import { Link } from 'react-router-dom'

const Services = ({ title, description, btnText, images, index, link }) => {
  const reverse = index % 2 !== 0

  return (
    <div className='py-3 md:py-14'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-x-20'>
        {/* Image Section */}
        <div
          className={`w-full md:w-1/2 p-4 ${
            reverse ? 'md:order-last' : 'md:order-first'
          }`}
        >
          <img
            src={images[0]}
            alt={title}
            className='w-full h-auto rounded-lg'
          />
        </div>

        {/* Text Section */}
        <div
          className={`w-full md:w-1/2 p-4 ${
            reverse ? 'md:text-left' : 'md:text-right'
          } text-left`}
        >
          <h1 className='text-3xl font-bold mb-4 text-primary'>{title}</h1>
          <p className='text-md mb-4 text-sm '>{description}</p>
          <Link to={link}>
            <button className='btn bg-primary text-white hover:bg-primary-hover'>
              {btnText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Services
