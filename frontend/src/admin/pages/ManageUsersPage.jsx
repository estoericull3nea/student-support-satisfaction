import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { formatTime } from '../../utils.js'

const UsersTable = () => {
  const [users, setUsers] = useState([]) // Initialize users as an empty array
  const [selectedUser, setSelectedUser] = useState(null) // For holding the selected user's data
  const [isModalOpen, setIsModalOpen] = useState(false) // For controlling modal visibility

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users')
        setUsers(response.data.format || response.data) // Ensure correct format is used
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  // Handle row click to show modal
  const handleRowClick = (user) => {
    setSelectedUser(user) // Set the selected user
    setIsModalOpen(true) // Open the modal
  }

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null) // Clear the selected user
  }

  return (
    <div className='overflow-x-auto'>
      <table className='table w-full'>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Verified</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className='cursor-pointer hover:bg-primary hover:text-white transition duration-300'
              onClick={() => handleRowClick(user)}
            >
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td
                className={
                  user.isVerified
                    ? 'text-green-500 font-bold'
                    : 'text-red-500 font-bold'
                }
              >
                {user.isVerified ? 'Verified' : 'Not Verified'}
              </td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Daisy UI Modal */}
      {selectedUser && (
        <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className='modal-box'>
            <h3 className='font-bold text-lg'>
              {selectedUser.firstName}'s Credentials
            </h3>
            <hr className='mt-3' />
            <p className='py-1 mt-3'>
              <strong>First Name:</strong> {selectedUser.firstName}
            </p>
            <p className='py-1'>
              <strong>Last Name:</strong> {selectedUser.lastName}
            </p>
            <p className='py-1'>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p className='py-1'>
              <strong>Verified:</strong>{' '}
              {selectedUser.isVerified ? 'Yes' : 'No'}
            </p>
            <p className='py-1'>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p className='py-1'>
              <strong>Profile Picture Link:</strong> {selectedUser.profilePic}
            </p>
            <p className='py-1'>
              <strong>Last Verification Request:</strong>{' '}
              {formatTime(selectedUser.lastVerificationRequest)}
            </p>

            <p className='py-1'>
              <strong>Created At:</strong> {formatTime(selectedUser.createdAt)}
            </p>

            <p className='py-1'>
              <strong>Updated At:</strong> {formatTime(selectedUser.updatedAt)}
            </p>

            {/* Add any other fields you want to display */}

            <div className='modal-action'>
              <button
                className='btn border-black text-black'
                onClick={handleCloseModal}
              >
                Close
              </button>

              <Link
                to={`/user/profile/${selectedUser._id}`}
                className='btn bg-primary hover:bg-primary-hover text-white'
                onClick={handleCloseModal}
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersTable
