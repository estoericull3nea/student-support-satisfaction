import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { formatTime } from '../../utils.js'

const UsersTable = () => {
  const [users, setUsers] = useState([]) // Initialize users as an empty array
  const [selectedUser, setSelectedUser] = useState(null) // For holding the selected user's data
  const [isModalOpen, setIsModalOpen] = useState(false) // For controlling view modal visibility
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false) // For controlling update modal visibility
  const [updatedUser, setUpdatedUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  }) // For handling user updates

  const [loading, setLoading] = useState(false) // Global loading state
  const [buttonLoading, setButtonLoading] = useState(null) // Loading state for individual buttons

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true) // Start loading
      try {
        const response = await axios.get('http://localhost:5000/api/users')
        setUsers(response.data.format || response.data) // Ensure correct format is used
      } catch (error) {
        console.error('Error fetching users:', error)
      }
      setLoading(false) // Stop loading after fetch
    }

    fetchUsers()
  }, [])

  // Handle row click to show view modal
  const handleRowClick = (user) => {
    setSelectedUser(user) // Set the selected user
    setIsModalOpen(true) // Open the view modal
  }

  // Handle closing the view modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null) // Clear the selected user
  }

  // Handle update button click
  const handleUpdateClick = (user) => {
    setUpdatedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }) // Set the fields to be updated
    setSelectedUser(user) // Keep track of the user being updated
    setIsUpdateModalOpen(true) // Open the update modal
  }

  // Handle form submission for updating user details
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()

    try {
      setButtonLoading('update') // Start button loading for update
      // Send a PUT request to update the user by ID
      await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      })

      // Update the user in the frontend
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, ...updatedUser } : user
        )
      )

      // Close the update modal
      setIsUpdateModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setButtonLoading(null) // Stop button loading
    }
  }

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUpdatedUser({ ...updatedUser, [name]: value })
  }

  // Handle setting user as inactive/active
  const handleSetInactive = async (id, currentStatus) => {
    setButtonLoading(id) // Start button loading for the specific user
    try {
      // Send a PATCH request to toggle the user's active status
      await axios.patch(`http://localhost:5000/api/users/${id}/status`, {
        active: !currentStatus,
      })

      // Update the user in the frontend to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, active: !currentStatus } : user
        )
      )
    } catch (error) {
      console.error('Error setting user active/inactive:', error)
    } finally {
      setButtonLoading(null) // Stop button loading for the specific user
    }
  }

  return (
    <div className='block overflow-x-auto'>
      {/* Loading spinner for table fetch */}
      {loading ? (
        <div className='flex justify-center items-center py-10'>
          <div className='btn btn-square loading'></div> {/* DaisyUI spinner */}
        </div>
      ) : (
        <table className='table table-auto w-full whitespace-nowrap'>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Active</th>
              <th>Role</th>
              <th>Action</th>
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
                <td
                  className={
                    user.active
                      ? 'text-green-500 font-bold'
                      : 'text-red-500 font-bold'
                  }
                >
                  {user.active ? 'Active' : 'Inactive'}
                </td>
                <td>{user.role}</td>
                <td className='flex flex-wrap'>
                  <button
                    className={`btn btn-sm btn-primary mr-2 ${
                      buttonLoading === 'update' ? 'loading' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation() // Prevent triggering row click
                      handleUpdateClick(user)
                    }}
                    disabled={buttonLoading === 'update'} // Disable during loading
                  >
                    Update
                  </button>
                  <button
                    className={`btn btn-sm ${
                      user.active ? 'btn-error' : 'btn-success'
                    } text-white ${
                      buttonLoading === user._id ? 'loading' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation() // Prevent triggering row click
                      handleSetInactive(user._id, user.active)
                    }}
                    disabled={buttonLoading === user._id} // Disable during loading
                  >
                    {user.active ? 'Inactive' : 'Make Active'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Daisy UI Modal for Viewing */}
      {selectedUser && (
        <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className='modal-box'>
            <h3 className='font-bold text-lg'>
              {selectedUser.firstName}'s Credentials
            </h3>
            <hr className='mt-3' />
            <p className='py-1 mt-3'>
              <strong>User ID:</strong> {selectedUser._id}
            </p>
            <p className='py-1'>
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
              <strong>Active:</strong> {selectedUser.active ? 'Yes' : 'No'}
            </p>
            <p className='py-1'>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p className='py-1'>
              <strong>Profile Picture Link:</strong> {selectedUser.profilePic}
            </p>
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

      {/* Daisy UI Modal for Updating */}
      {isUpdateModalOpen && (
        <div className={`modal modal-open`}>
          <div className='modal-box'>
            <h3 className='font-bold text-lg'>Update User Information</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>First Name</span>
                </label>
                <input
                  type='text'
                  name='firstName'
                  value={updatedUser.firstName}
                  onChange={handleInputChange}
                  className='input input-bordered'
                  required
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Last Name</span>
                </label>
                <input
                  type='text'
                  name='lastName'
                  value={updatedUser.lastName}
                  onChange={handleInputChange}
                  className='input input-bordered'
                  required
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input
                  type='email'
                  name='email'
                  value={updatedUser.email}
                  onChange={handleInputChange}
                  className='input input-bordered'
                  required
                />
              </div>
              <div className='modal-action'>
                <button
                  className={`btn ${
                    buttonLoading === 'update' ? 'loading' : ''
                  }`}
                  type='submit'
                  disabled={buttonLoading === 'update'} // Disable during loading
                >
                  Save Changes
                </button>
                <button
                  className='btn btn-error'
                  type='button'
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersTable
