import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Heading from './components/Heading'

import { servicesData } from './constants'

const App = () => {
  return (
    <>
      <Navbar />
      <Hero />

      <Heading
        title='Our Services'
        tagline='Explore Our Offerings'
        description='Discover the comprehensive range of services we provide to support the educational journey'
      />
    </>
  )
}

export default App
