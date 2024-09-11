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

const SchoolAdministrator = () => {
  return (
    <>
      <Navbar />
      {/* Top */}
      <div>
        <div className='container flex items-center justify-start lg:justify-center   '>
          {/* Left */}
          <div className='max-w-[400px] py-16 xl:py-0 space-y-3'>
            <span className='text-[.8rem]'>Services</span>
            <h1 className='font-bold text-5xl tracking-wider text-primary'>
              Office of the School Administrator
            </h1>
            <p>
              Welcome to the Office of the School Administrator, the central hub
              for administrative support and services essential to the smooth
              operation of our institution.
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
          {/*Office of the School Administrator */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Office of the School Administrator
            </h2>

            <p>
              At the heart of our school's administration lies the Office of the
              School Administrator, dedicated to providing comprehensive
              administrative services to students, faculty, and staff alike. In
              this section, you'll find a detailed description of the
              administrative services we offer, including student enrollment
              processes, scheduling assistance, and staff management. Our goal
              is to streamline administrative processes and ensure the efficient
              functioning of our school community.
            </p>
          </div>

          {/*  Administrative Staff */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Administrative Staff
            </h2>
            <p>
              Meet the dedicated individuals who form the backbone of our
              administrative team. From key administrators to support staff
              members, each plays a vital role in providing assistance and
              support to our school community. Learn more about our team
              members' backgrounds, roles, and areas of expertise, and discover
              how you can contact the administrative office for assistance with
              your administrative needs.
            </p>
          </div>

          {/* Administrative Procedures */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Administrative Procedures
            </h2>
            <p>
              Navigating administrative procedures can sometimes be complex, but
              we're here to help make it as straightforward as possible. In this
              section, you'll find a step-by-step guide to common administrative
              procedures, such as course registration, enrollment changes, and
              more. Additionally, access the necessary forms and documents
              required for various administrative tasks, ensuring a seamless
              experience for all stakeholders.
            </p>
          </div>

          {/* Contact Information */}
          <div className='our-library space-y-4 '>
            <h2 className='font-bold text-3xl tracking-wide text-primary'>
              Contact Information
            </h2>
            <p>
              Your convenience and accessibility are our priorities. If you have
              any questions, concerns, or require assistance with administrative
              matters, our team is here to help. Find the contact information
              for our administrative staff, including email addresses, phone
              numbers, and office hours, in this section. Whether you prefer to
              reach out via email, phone, or in person, we're committed to
              providing prompt and responsive support to meet your needs.
            </p>
          </div>

          {/* Box */}
          <div className='p-3 shadow-xl md:p-10 space-y-4 mx-auto'>
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
              Thank you for entrusting us with your administrative needs. We're
              dedicated to serving you and ensuring a positive experience for
              every member of our school community.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default SchoolAdministrator
