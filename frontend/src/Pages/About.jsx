import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import ucsLoginRegisterCover from '../assets/images/ucsLoginRegisterCover.jpg'
import authenticity from '../assets/images/icons/authenticity.png'
import leadership from '../assets/images/icons/leadership.png'
import storytelling from '../assets/images/icons/storytelling.png'
import partners from '../assets/images/icons/partners.png'
import sustainability from '../assets/images/icons/sustainability.png'

import hand from '../assets/images/icons/hand.png'
import youth from '../assets/images/icons/youth.png'
import compliant from '../assets/images/icons/compliant.png'
import trophy from '../assets/images/icons/trophy.png'
import businessWorld from '../assets/images/icons/business-world.png'
import Breadcrumbs from '../components/Breadcrumbs'

import { Link } from 'react-router-dom'

const About = () => {
  return (
    <>
      <Navbar />
      <Breadcrumbs />

      <div className=' '>
        {/* <img
          src={ucsLoginRegisterCover}
          alt=''
          className='absolute top-[72px] left-0 z-[-1] h-full w-full object-cover brightness-75'
        /> */}
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${ucsLoginRegisterCover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '20px 0',
          }}
        >
          <div className='container'>
            <div className='max-w-[800px] py-20 space-y-8 sm:space-y-4 text-center sm:text-left '>
              <span className='text-xs  font-semibold tracking-wider text-white'>
                About Us
              </span>
              <h1 className='text-4xl sm:text-5xl font-bold text-white'>
                Forming <span className='text-primary'>Christ-Centered</span>{' '}
                Stewards Through Holistic Education
              </h1>
              <p className='text-sm max-w-[500px] text-white'>
                At Urbiztondo Catholic School - ALDCS, we are committed to
                nurturing individuals grounded in faith, integrity, and
                compassion. Our focus is on providing a holistic education that
                fosters both academic excellence and spiritual development.
              </p>
              <Link
                to='/contact-us'
                className='btn bg-primary hover:bg-primary-hover text-white'
              >
                Get in Touch with Us
              </Link>
            </div>
          </div>
        </div>

        <div className='container text-center py-10 space-y-16'>
          <div className='space-y-3 max-w-[500px] mx-auto'>
            <h1 className='text-4xl font-bold text-primary'>Our Vision</h1>
            <p>
              In communio, Urbiztondo Catholic School - ALDCS forms
              Christ-centered stewards through holistic education and formation.
            </p>
          </div>

          <div className='divider'></div>

          <div className='space-y-3 max-w-[500px] mx-auto'>
            <h1 className='text-4xl font-bold text-primary'>Our Mission</h1>
            <p>
              To achieve our vision, Urbiztondo Catholic School - ALDCS is
              dedicated to:
            </p>
          </div>

          <div className='boxes flex flex-wrap justify-center  gap-5'>
            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={authenticity} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>Authenticity</h1>
              <p className='text-sm'>
                Fostering a Catholic identity centered on Jesus Christ, aligned
                with Church teachings.
              </p>
            </div>

            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={leadership} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>Leadership</h1>
              <p className='text-sm'>
                Ensuring dynamic school operations through effective governance.
              </p>
            </div>

            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={storytelling} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>
                Developmental Learning
              </h1>
              <p className='text-sm'>
                Implementing a curriculum infused with Gospel values, promoting
                both academic and spiritual growth.
              </p>
            </div>

            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={partners} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>Community</h1>
              <p className='text-sm'>
                Building a harmonious, inclusive community that celebrates
                diversity and unity.
              </p>
            </div>

            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={sustainability} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>
                Sustainability
              </h1>
              <p className='text-sm'>
                Advancing institutional growth by establishing meaningful
                partnerships and linkages.
              </p>
            </div>
          </div>

          <div className='divider'></div>

          <div className='space-y-3 max-w-[500px] mx-auto'>
            <h1 className='text-4xl font-bold text-primary'>Our Core Values</h1>
            <p>The core values that guide our mission and vision include:</p>
          </div>

          <div className='boxes flex flex-wrap justify-center  gap-5'>
            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={hand} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>
                Authentic Witnessing
              </h1>
              <p className='text-sm'>
                Living the Gospel in our daily actions and commitments.
              </p>
            </div>

            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={compliant} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>
                Good Governance and Ethical Leadership
              </h1>
              <p className='text-sm'>
                Leading with integrity, responsibility, and transparency.
              </p>
            </div>

            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={trophy} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>
                Excellence and Relevance
              </h1>
              <p className='text-sm'>
                Striving for educational excellence that is meaningful and
                transformative.
              </p>
            </div>

            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={businessWorld} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>
                Responsible Stewardship
              </h1>
              <p className='text-sm'>
                Managing resources responsibly for the good of our school
                community.
              </p>
            </div>

            <div className='shadow-2xl rounded-lg p-10 max-w-[300px] space-y-2 flex flex-col items-center justify-center'>
              <img src={youth} alt='' className='h-[40px]' />
              <h1 className='font-bold text-primary text-2xl'>
                Communion/Community
              </h1>
              <p className='text-sm'>
                Emphasizing unity, collaboration, and respect for diversity in
                all aspects of our community life.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
