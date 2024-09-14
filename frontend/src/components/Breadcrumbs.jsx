import React from 'react'
import { Link, useLocation } from 'react-router-dom'

// Helper function to map path segments to readable names
const pathNames = {
  '': 'Home',
  'about-us': 'About Us',
  'contact-us': 'Contact',
  register: 'Sign Up',
  login: 'Sign In',
  library: 'Library',
  'office-of-the-school-principal': 'Office of the School Principal',
  'office-of-the-school-administrator': 'Office of the School Administrator',
  'office-of-the-registrar': 'Office of the Registrar',
  'forgot-password': 'Forgot Password',
}

const Breadcrumbs = () => {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean) // Split and filter empty segments

  // Create an array of breadcrumb links
  const breadcrumbs = pathSegments.map((segment, index) => {
    const routeTo = `/${pathSegments.slice(0, index + 1).join('/')}`
    return (
      <li key={segment}>
        <Link to={routeTo}>{pathNames[segment] || segment}</Link>
      </li>
    )
  })

  return (
    <div className='container'>
      <div className='breadcrumbs text-sm my-5'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          {breadcrumbs}
        </ul>
      </div>
    </div>
  )
}

export default Breadcrumbs
