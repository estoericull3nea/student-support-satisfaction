import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Heading from '../components/Heading'
import Footer from '../components/Footer'

import { servicesData } from '../constants'

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />

      <Heading
        title='Our Services'
        tagline='Explore Our Offerings'
        description='Discover the comprehensive range of services we provide to support the educational journey'
      />

      {servicesData.map((service, index) => (
        <Services
          key={service.id || index} // Preferably use a unique service id if available
          title={service.title}
          description={service.description}
          btnText={service.btnText}
          images={service.images}
          reverse={index % 2 !== 0}
          index={index}
          link={service.link}
        />
      ))}

      <Footer />
    </>
  )
}

export default LandingPage
