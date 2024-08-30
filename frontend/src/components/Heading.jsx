import React from 'react'

const Heading = ({ title, tagline, description }) => {
  return (
    <>
      <div className='text-center py-14 space-y-3 border-b-2 border-black'>
        <h3 className='font-medium'>{title}</h3>
        <h1 className='text-4xl text-primary font-extrabold'>{tagline}</h1>
        <p>{description}</p>
      </div>
    </>
  )
}

export default Heading
