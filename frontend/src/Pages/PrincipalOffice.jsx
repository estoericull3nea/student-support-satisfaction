import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import ucsHeroPageTemp from '../assets/images/ucsHeroPageTemp.png'

// React Icons
import { BsFillEmojiAngryFill } from 'react-icons/bs'
import { BsEmojiFrownFill } from 'react-icons/bs'
import { BsEmojiNeutralFill } from 'react-icons/bs'
import { BsFillEmojiSmileFill } from 'react-icons/bs'
import { BsEmojiGrinFill } from 'react-icons/bs'

const PrincipalOffice = () => {
  return (
    <>
      <Navbar />
      {/* Top */}
      <div>
        <div className='container flex items-center justify-start lg:justify-center   '>
          {/* Left */}
          <div className='max-w-[400px] p-5 xl:p-0 space-y-3'>
            <span className='text-[.8rem]'>Services</span>
            <h1 className='font-bold text-5xl tracking-wider text-primary'>
              Office of the School Principal
            </h1>
            <p>
              Welcome to the Office of the School Principal, where we are
              dedicated to fostering a positive and nurturing learning
              environment for all students and staff.
            </p>
            <a
              href='#'
              className='btn bg-primary hover:bg-primary-hover text-white'
            >
              Read More
            </a>
          </div>

          {/* Right */}
          <div className='max-w-[650px] lg:block hidden'>
            <img src={ucsHeroPageTemp} alt='' />
          </div>
        </div>
      </div>
      {/* Bottom */}
      <div className='py-10 container'>
        {/* Images */}
        <div className='flex justify-center gap-3 flex-wrap '>
          <img
            src='https://img.freepik.com/free-photo/ancient-books-adorn-library-carefully-arranged-with-classics-rare-gems_157027-2332.jpg?size=626&ext=jpg&ga=GA1.1.553209589.1713484800&semt=sph'
            alt=''
            className='rounded-lg px-3 max-w-[350px]  '
          />
          <img
            src='https://images.pexels.com/photos/877971/pexels-photo-877971.jpeg?auto=compress&cs=tinysrgb&w=400'
            alt=''
            className='rounded-lg px-3 max-w-[350px]  '
          />
          <img
            src='https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
            alt=''
            className='rounded-lg px-3 max-w-[350px]  '
          />
        </div>

        {/* Text and Box */}
        <div className='max-w-[600px] mx-auto space-y-10 py-10 rounded-md'>
          {/* Office of the School Principal */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Office of the School Principal
            </h2>

            <p>
              At the heart of our institution, the Office of the School
              Principal plays a crucial role in guiding the vision and mission
              of our school. We are committed to providing strong leadership and
              support to ensure the success and well-being of our school
              community. In this section, you will find a detailed explanation
              of the role and responsibilities of the principal's office,
              including insights into our leadership style, goals, and ongoing
              initiatives.
            </p>
          </div>

          {/*  Meet the Principal */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Meet the Principal
            </h2>
            <p>
              Get to know our school principal, [Principal's Name], who brings
              [his/her] wealth of experience and dedication to our institution.
              Learn about [his/her] background, educational philosophy, and
              vision for our school's future. Additionally, hear directly from
              students, faculty, and parents through testimonials and quotes
              about the positive impact of [Principal's Name]'s leadership on
              our school community.
            </p>
          </div>

          {/* Policies and Procedures */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Policies and Procedures
            </h2>
            <p>
              Transparency and accountability are key principles of our school's
              administration. In this section, you will find an overview of the
              various policies and procedures implemented by the principal's
              office. From disciplinary procedures to academic regulations, we
              strive to create a safe, inclusive, and conducive learning
              environment for all. Explore our policies and procedures to better
              understand our expectations and guidelines for student conduct and
              academic excellence.
            </p>
          </div>

          {/* Contact Information */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Contact Information
            </h2>
            <p>
              Your feedback and input are important to us. If you have any
              questions, concerns, or ideas you'd like to share with the
              principal's office, we encourage you to reach out. In this
              section, you will find instructions on how to schedule meetings
              with the principal or address concerns. We are here to listen,
              support, and collaborate with our school community to ensure the
              success and well-being of every student.
            </p>
          </div>

          {/* Box */}
          <div className='shadow-xl p-3 md:p-10 space-y-4 mx-auto'>
            {/* Give us feedback */}
            <h3 className='font-semibold text-2xl'>
              Give us <span className='text-primary'>feedback</span>
            </h3>

            {/* We value your feedback! */}
            <p className='text-gray-500 font-light text-sm'>
              We value your feedback! Share your thoughts and experiences with
              the Library. Your input helps us improve our services to better
              meet your needs.
            </p>

            {/* Reaction */}
            <ul className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 justify-center items-center gap-2'>
              <li>
                <input
                  type='radio'
                  id='very-dissatisfied'
                  name='hosting'
                  value='very-dissatisfied'
                  className='hidden peer'
                  required
                />
                <label
                  htmlFor='very-dissatisfied'
                  className='inline-flex space-x-1 items-center justify-between w-full p-3 text-black bg-white border border-primary rounded-lg cursor-pointer  peer-checked:bg-primary peer-checked:text-white hover:text-white hover:bg-primary-hover '
                >
                  <div className='block'>
                    <div className='w-full text-xs'>Very Dissatisfied</div>
                  </div>
                  <BsFillEmojiAngryFill />
                </label>
              </li>

              <li>
                <input
                  type='radio'
                  id='dissatisfied'
                  name='hosting'
                  value='dissatisfied'
                  className='hidden peer'
                  required
                />
                <label
                  htmlFor='dissatisfied'
                  className='inline-flex space-x-1 items-center justify-between w-full p-3 text-black bg-white border border-primary rounded-lg cursor-pointer  peer-checked:bg-primary peer-checked:text-white hover:text-white hover:bg-primary-hover '
                >
                  <div className='block'>
                    <div className='w-full text-xs'>Dissatisfied</div>
                  </div>
                  <BsEmojiFrownFill />
                </label>
              </li>

              <li>
                <input
                  type='radio'
                  id='neutral'
                  name='hosting'
                  value='neutral'
                  className='hidden peer'
                  required
                />
                <label
                  htmlFor='neutral'
                  className='inline-flex space-x-1 items-center justify-between w-full p-3 text-black bg-white border border-primary rounded-lg cursor-pointer  peer-checked:bg-primary peer-checked:text-white hover:text-white hover:bg-primary-hover '
                >
                  <div className='block'>
                    <div className='w-full text-xs'>Neutral</div>
                  </div>
                  <BsEmojiNeutralFill />
                </label>
              </li>

              <li>
                <input
                  type='radio'
                  id='satisfied'
                  name='hosting'
                  value='satisfied'
                  className='hidden peer'
                  required
                />
                <label
                  htmlFor='satisfied'
                  className='inline-flex space-x-1 items-center justify-between w-full p-3 text-black bg-white border border-primary rounded-lg cursor-pointer  peer-checked:bg-primary peer-checked:text-white hover:text-white hover:bg-primary-hover '
                >
                  <div className='block'>
                    <div className='w-full text-xs'>Satisfied</div>
                  </div>
                  <BsFillEmojiSmileFill />
                </label>
              </li>

              <li>
                <input
                  type='radio'
                  id='very-satisfied'
                  name='hosting'
                  value='very-satisfied'
                  className='hidden peer'
                  required
                />
                <label
                  htmlFor='very-satisfied'
                  className='inline-flex space-x-1 items-center justify-between w-full p-3 text-black bg-white border border-primary rounded-lg cursor-pointer  peer-checked:bg-primary peer-checked:text-white hover:text-white hover:bg-primary-hover '
                >
                  <div className='block'>
                    <div className='w-full text-xs'>Very Satisfied</div>
                  </div>
                  <BsEmojiGrinFill />
                </label>
              </li>
            </ul>

            {/* Comment */}
            <div className='space-y-2'>
              <h3>
                Comment <span className='text-red-700'>*</span>
              </h3>
              <p className='text-sm'>
                Feel free to share any additional feedback, comments, or
                suggestions below. Your input helps us improve our services.
                Thank you!
              </p>
              <textarea
                className='textarea textarea-bordered w-full'
                placeholder='Type here'
              ></textarea>
            </div>

            {/* Email Address */}
            <label className='form-control w-full'>
              <div className='label'>
                <span className='label-text'>
                  Email Address <span className='text-red-700'>*</span>
                </span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full input-md'
              />
            </label>
          </div>

          {/* Pre Footer */}
          <div>
            <p className='text-center'>
              Thank you for visiting the Office of the School Principal.
              Together, let's continue to inspire excellence and empower the
              future leaders of tomorrow.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PrincipalOffice
