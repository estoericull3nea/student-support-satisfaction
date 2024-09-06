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

const Library = () => {
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
              Library
            </h1>
            <p>
              Welcome to our library, where we offer a wealth of resources,
              services, and facilities to support your academic journey.
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
            <img src={ucsHeroPageTemp} alt='Library Hero Image' />
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
          {/* Our Library */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Our Library
            </h2>
            <p>
              Our collection includes a diverse range of materials, from books
              and journals to multimedia resources, catering to a variety of
              interests and academic disciplines. Whether you're conducting
              research, studying for exams, or simply exploring new topics,
              you'll find plenty to discover within our extensive collection.
            </p>

            <p>
              In addition to our vast array of resources, we provide comfortable
              study spaces, equipped with modern amenities to enhance your
              learning experience. From quiet reading areas to collaborative
              study rooms, you'll find the perfect environment to focus and
              engage with your studies. Our computer labs and printing
              facilities are also available to assist you with your academic
              projects and assignments.
            </p>
            <p>
              At our library, we are committed to providing the support and
              resources you need to succeed in your academic endeavors. Explore
              our collection, utilize our facilities, and let us help you on
              your journey to academic excellence.
            </p>
          </div>

          {/* Library Staff */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Library Staff
            </h2>
            <p>
              Behind every great library is a dedicated team of professionals
              ready to assist you. Meet our knowledgeable librarians and support
              staff, who are here to help you navigate our resources and answer
              any questions you may have. Whether you need research assistance,
              guidance on citing sources, or recommendations for your next read,
              we're here to support your academic journey.
            </p>
          </div>

          {/* Contact Information */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Contact Information
            </h2>
            <p>
              Your feedback and suggestions are valuable to us. If you have any
              questions, comments, or special requests, please don't hesitate to
              get in touch. In this section, you'll find contact information for
              our library staff, including email addresses, phone numbers, and
              office hours. Whether you prefer to reach out in person, by phone,
              or via email, we're here to assist you and ensure your library
              experience is a positive and enriching one.
            </p>
          </div>

          {/* Box */}
          <form className='shadow-xl p-3 md:p-10 space-y-4 mx-auto'>
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

            <div className='text-end'>
              <button
                type='submit'
                className='btn bg-primary hover:bg-primary-hover text-white'
              >
                Submit
              </button>
            </div>
          </form>

          {/* Pre Footer */}
          <div>
            <p className='text-center'>
              Thank you for visiting our library. We look forward to supporting
              your academic journey and helping you unlock the power of
              knowledge and discovery.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Library
