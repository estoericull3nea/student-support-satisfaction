import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const RedirectIfAuthenticated = ({ children }) => {
  const token = localStorage.getItem('token')

  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decodedToken.exp > currentTime) {
        // If the token is still valid, redirect the user away from the login page
        return <Navigate to='/' />
      }
    } catch (error) {
      localStorage.removeItem('token')
    }
  }

  // If no token or token is expired, show the login page
  return children
}

export default RedirectIfAuthenticated
