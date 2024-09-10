import React, { useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

import toast from 'react-hot-toast'

const Protect = ({ children }) => {
  const token = localStorage.getItem('token')
  const location = useLocation() // Get current location (the protected route)
  const toastShown = useRef(false)

  useEffect(() => {
    if (!toastShown.current) {
      if (!token) {
        toast.error('You need to log in first!')
      } else {
        try {
          const decodedToken = jwtDecode(token)
          const currentTime = Date.now() / 1000

          if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token')
            toast.error('Session expired. Please log in again!')
          }
        } catch (error) {
          toast.error('Invalid token. Please log in again.')
        }
      }
      toastShown.current = true
    }
  }, [token])

  // Handle redirection logic to login, storing the previous route
  if (!token || (token && jwtDecode(token).exp < Date.now() / 1000)) {
    // Redirect to login with the current path in the `redirect` query parameter
    return <Navigate to={`/login?redirect=${location.pathname}`} />
  }

  return children
}

export default Protect
