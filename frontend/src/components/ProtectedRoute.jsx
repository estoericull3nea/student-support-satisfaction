// src/components/ProtectedRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'
import { getRoleFromToken } from '../utils'

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const role = getRoleFromToken()

  // If no allowedRoles is provided, the route is public
  if (!allowedRoles || allowedRoles.length === 0) {
    return Component
  }

  // Block 'admin' role from accessing non-customer/non-admin routes
  if (
    role === 'admin' &&
    !allowedRoles.includes('admin') &&
    !allowedRoles.includes('customer')
  ) {
    return <Navigate to='/unauthorized' />
  }

  // Allow access if the user's role is included in allowedRoles
  if (role && allowedRoles.includes(role)) {
    return Component
  }

  if (role === 'admin') {
    return <Navigate to='/unauthorized' />
  }

  if (role === 'customer') {
    return <Navigate to='/unauthorized' />
  }
}

export default ProtectedRoute
