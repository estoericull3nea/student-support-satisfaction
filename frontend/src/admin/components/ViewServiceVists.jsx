import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ViewServiceVisits = ({ serviceName }) => {
  const [visits, setVisit] = useState()

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_DEV_BACKEND_URL
          }/api/visit/service/${serviceName}`
        )
        setVisit(response.data[0].visitCount) // Make sure to set response.data
      } catch (error) {
        console.error('Error fetching visits:', error)
      }
    }

    fetchVisits()
  }, [serviceName])

  return (
    <div className='p-3 border max-w-max my-5 rounded'>Visited: {visits}</div>
  )
}

export default ViewServiceVisits
