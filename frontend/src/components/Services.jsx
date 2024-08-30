import React from 'react'

const Services = ({ title, description, btnText, images, index, link }) => {
  const reverse = index % 2 !== 0 // Alternate layout based on index

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
          <a
            className='btn bg-primary text-white hover:bg-primary-hover'
            href={link}
          >
            {btnText}
          </a>
        </div>
      </div>
    </div>
  )
}

export default Services
