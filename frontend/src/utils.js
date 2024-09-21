export const formatTime = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: true,
  }

  return new Date(date).toLocaleString('en-US', options)
}

import { jwtDecode } from 'jwt-decode'

export const getRoleFromToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const decodedToken = jwtDecode(token)

    return decodedToken.role
  } catch (error) {
    console.error('Invalid token', error)
    return null
  }
}
