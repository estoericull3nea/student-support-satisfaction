import React from 'react'

const Heading = ({ title, tagline, description }) => {
  return (
    <>
      <div className='text-center py-14 space-y-4 border-b-2 border-black px-3'>
        <h3 className='font-medium'>{title}</h3>
        <h1 className='text-3xl sm:text-4xl text-primary font-extrabold'>
          {tagline}
        </h1>
        <p className='max-w-[500px] mx-auto'>{description}</p>
      </div>
    </>
  )
}

export default Heading
