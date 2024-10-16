import React, { useEffect, useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { formatToMMDDYYYY } from '../../../../backend/api/utils/formatToMonthDayYear'

const AllUsers = () => {
  const [inactiveUsers, setInactiveUsers] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isUpdateDialogVisible, setIsUpdateDialogVisible] = useState(false)
  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    firstName: '',
    lastName: '',
    password: '',
    active: false,
    isVerified: false,
  })

  const [isAddUserDialogVisible, setIsAddUserDialogVisible] = useState(false)
  const [newUserDetails, setNewUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    active: false,
    isVerified: false,
  })

  const errorShownRef = useRef(false)

  const [isFeedbackDialogVisible, setIsFeedbackDialogVisible] = useState(false)
  const [userFeedbacks, setUserFeedbacks] = useState([])

  // Function to open "Add User" dialog
  const openAddUserDialog = () => {
    setIsAddUserDialogVisible(true)
  }

  // Function to handle adding a user
  const handleAddStudent = async () => {
    if (
      !newUserDetails.firstName ||
      !newUserDetails.lastName ||
      !newUserDetails.email ||
      !newUserDetails.password
    ) {
      toast.error('All fields are required')
      return
    }

    console.log(newUserDetails)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/users/add-user`,
        newUserDetails
      )
      const addedUser = response.data.newUser
      setInactiveUsers((prevUsers) => [...prevUsers, addedUser])
      toast.success('User added successfully')
      setIsAddUserDialogVisible(false)
      setNewUserDetails({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        active: false,
        isVerified: false,
      })
    } catch (error) {
      console.error('Error adding user:', error)
      toast.error('Failed to add user')
    }
  }

  // Fetch feedbacks for the selected user based on email
  const fetchFeedbacksByEmail = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/feedbacks/${userId}`
      )
      setUserFeedbacks(response.data)
      setIsFeedbackDialogVisible(true)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  // Open feedback dialog when "Feedbacks" button is clicked
  const openFeedbackDialog = (rowData) => {
    fetchFeedbacksByEmail(rowData._id)
  }

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/users`
      )
      setInactiveUsers(response.data.format)
      errorShownRef.current = false
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (!errorShownRef.current) {
          toast.error('No active students found.')
          errorShownRef.current = true
        }
        setInactiveUsers([])
      } else {
        toast.error(error.response?.data?.message || 'An error occurred')
      }
    }
  }

  useEffect(() => {
    fetchAllStudents()
  }, [])

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value)
  }

  const viewUserDetails = (rowData) => {
    setSelectedUser(rowData)
    setIsDialogVisible(true)
  }

  const openUpdateDialog = (rowData) => {
    setSelectedUser(rowData)
    setUpdatedUserDetails({
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      password: '',
      active: rowData.active,
      isVerified: rowData.isVerified,
    })
    setIsUpdateDialogVisible(true)
  }

  const handleUpdateUser = async () => {
    if (!updatedUserDetails.firstName || !updatedUserDetails.lastName) {
      toast.error('All fields required')
      return
    }

    try {
      const { _id } = selectedUser
      const response = await axios.put(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/users/${_id}`,
        updatedUserDetails
      )
      const updatedUser = response.data.updatedUser
      setInactiveUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      )
      toast.success('User updated successfully')
      setIsUpdateDialogVisible(false)
      fetchAllStudents()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    }
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className='space-x-2'>
        <Button
          label='View'
          icon='pi pi-eye'
          className='p-button-info border p-2 text-[.7rem] rounded'
          onClick={() => viewUserDetails(rowData)}
        />

        <Button
          label='Feedbacks'
          icon='pi pi-eye'
          className='p-button-warning border p-2 text-[.7rem] rounded'
          onClick={() => openFeedbackDialog(rowData)}
        />

        <Button
          label='Update'
          icon='pi pi-pencil'
          className='p-button-warning border p-2 text-[.7rem] rounded'
          onClick={() => openUpdateDialog(rowData)}
        />
      </div>
    )
  }

  return (
    <div>
      <div className='breadcrumbs text-sm'>
        <ul>
          <li>
            <Link to='/admin'>Home</Link>
          </li>
          <li>
            <Link to='/admin'>Admin</Link>
          </li>
          <li>All Students</li>
        </ul>
      </div>

      {/* Add User Button */}
      <div className='text-end'>
        <Button
          label='Add Student'
          icon='pi pi-plus'
          className='p-button-success my-3 border text-sm p-2 rounded'
          onClick={openAddUserDialog}
        />
      </div>

      <div className='p-inputgroup my-3'>
        <InputText
          value={globalFilter}
          onChange={onGlobalFilterChange}
          placeholder='Search anything...'
          className='text-xs border p-3'
        />
      </div>

      <DataTable
        value={inactiveUsers}
        paginator
        rows={10}
        globalFilter={globalFilter}
        className='text-xs'
      >
        <Column
          field='firstName'
          header='First Name'
          sortable
          filter
          filterPlaceholder='Filter by First Name'
        />
        <Column
          field='lastName'
          header='Last Name'
          sortable
          filter
          filterPlaceholder='Filter by Last Name'
        />
        <Column
          field='email'
          header='Email'
          sortable
          filter
          filterPlaceholder='Filter by Email'
        />
        <Column
          field='isVerified'
          header='Is Verified'
          sortable
          filter
          filterPlaceholder='Filter by Status'
        />
        <Column header='Actions' body={actionBodyTemplate} />
      </DataTable>

      <Dialog
        header='Student Details'
        visible={isDialogVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => setIsDialogVisible(false)}
      >
        {selectedUser && (
          <div>
            <p>
              <strong>ID:</strong> {selectedUser._id}
            </p>
            <p>
              <strong>First Name:</strong> {selectedUser.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedUser.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Active:</strong>{' '}
              {selectedUser.active ? 'Active' : 'Not Active'}
            </p>
            <p>
              <strong>Verified:</strong>{' '}
              {selectedUser.isVerified ? 'Verified' : 'Not Verified'}
            </p>
            <p>
              <strong>Registered At:</strong>{' '}
              {new Date(selectedUser.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{' '}
              {new Date(selectedUser.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </Dialog>

      {/* Feedbacks Dialog */}
      <Dialog
        header='Students Feedbacks'
        visible={isFeedbackDialogVisible}
        style={{ width: '700px' }}
        modal
        onHide={() => setIsFeedbackDialogVisible(false)}
      >
        {userFeedbacks.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='table w-full'>
              <thead>
                <tr>
                  <th>Feedback ID</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {userFeedbacks.map((feedback, index) => (
                  <tr key={index}>
                    <td>{feedback._id}</td>
                    <td>{feedback.rating}</td>
                    <td>{feedback.comment}</td>
                    <td>{formatToMMDDYYYY(feedback.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No feedbacks found for this user.</p>
        )}
      </Dialog>

      {/* Add User Dialog */}
      <Dialog
        header='Add New Student'
        visible={isAddUserDialogVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => setIsAddUserDialogVisible(false)}
      >
        <div className='p-fluid'>
          {/* First Name */}
          <div className='p-field'>
            <div className='label'>
              <label htmlFor='firstName'>First Name</label>
            </div>
            <InputText
              id='firstName'
              value={newUserDetails.firstName}
              className='input input-bordered w-full input-sm'
              placeholder='Type here'
              onChange={(e) =>
                setNewUserDetails({
                  ...newUserDetails,
                  firstName: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Last Name */}
          <div className='p-field'>
            <div className='label'>
              <label htmlFor='lastName'>Last Name</label>
            </div>
            <InputText
              id='lastName'
              value={newUserDetails.lastName}
              className='input input-bordered w-full input-sm'
              placeholder='Type here'
              onChange={(e) =>
                setNewUserDetails({
                  ...newUserDetails,
                  lastName: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Email */}
          <div className='p-field'>
            <div className='label'>
              <label htmlFor='email'>Email</label>
            </div>
            <InputText
              id='email'
              type='email'
              value={newUserDetails.email}
              className='input input-bordered w-full input-sm'
              placeholder='Type here'
              onChange={(e) =>
                setNewUserDetails({ ...newUserDetails, email: e.target.value })
              }
              required
            />
          </div>

          {/* Password */}
          <div className='p-field'>
            <div className='label'>
              <label htmlFor='password'>Password</label>
            </div>

            <InputText
              id='password'
              type='password'
              className='input input-bordered w-full input-sm'
              placeholder='Type here'
              value={newUserDetails.password}
              onChange={(e) =>
                setNewUserDetails({
                  ...newUserDetails,
                  password: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Active Checkbox */}
          <div className='p-field-checkbox flex items-center'>
            <div className='label'>
              <label htmlFor='active'>Active</label>
            </div>
            <input
              type='checkbox'
              id='active'
              checked={newUserDetails.active}
              onChange={(e) =>
                setNewUserDetails({
                  ...newUserDetails,
                  active: e.target.checked,
                })
              }
            />
          </div>

          {/* Verified Checkbox */}
          <div className='p-field-checkbox flex items-center'>
            <div className='label'>
              <label htmlFor='isVerified'>Verified</label>
            </div>
            <input
              type='checkbox'
              id='isVerified'
              checked={newUserDetails.isVerified}
              onChange={(e) =>
                setNewUserDetails({
                  ...newUserDetails,
                  isVerified: e.target.checked,
                })
              }
            />
          </div>

          {/* Submit Button */}
          <div className='p-field'>
            <Button
              label='Add Student'
              onClick={handleAddStudent}
              className='border mt-3 py-2 bg-primary hover:bg-primary-hover text-white rounded'
            />
          </div>
        </div>
      </Dialog>

      {/* Update User Dialog */}
      <Dialog
        header='Update User'
        visible={isUpdateDialogVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => setIsUpdateDialogVisible(false)}
        className='text-sm'
      >
        <div className='p-fluid'>
          <div className='flex gap-x-2'>
            <div className='p-field'>
              <div className='label'>
                <label htmlFor='firstName'>First Name</label>
              </div>
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full max-w-xs input-sm'
                id='firstName'
                value={updatedUserDetails.firstName}
                onChange={(e) =>
                  setUpdatedUserDetails({
                    ...updatedUserDetails,
                    firstName: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='p-field'>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <label htmlFor='lastName'>Last Name</label>
                </div>
                <input
                  type='text'
                  placeholder='Type here'
                  className='input input-bordered w-full max-w-xs input-sm'
                  id='lastName'
                  value={updatedUserDetails.lastName}
                  onChange={(e) =>
                    setUpdatedUserDetails({
                      ...updatedUserDetails,
                      lastName: e.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>
          </div>

          <div className='p-field'>
            <div className='label'>
              <label htmlFor='password'>Password</label>
            </div>

            <input
              type='password'
              placeholder='Enter new password'
              className='input input-bordered w-full  input-sm'
              id='lastName'
              value={updatedUserDetails.password}
              onChange={(e) =>
                setUpdatedUserDetails({
                  ...updatedUserDetails,
                  password: e.target.value,
                })
              }
            />
          </div>

          <div className='p-field-checkbox flex'>
            <div className='label'>
              <label htmlFor='isVerified'>Verified</label>
            </div>
            <input
              type='checkbox'
              id='isVerified'
              checked={updatedUserDetails.isVerified}
              onChange={(e) =>
                setUpdatedUserDetails({
                  ...updatedUserDetails,
                  isVerified: e.target.checked,
                })
              }
            />
          </div>

          <div className='p-field'>
            <Button
              label='Update'
              onClick={handleUpdateUser}
              className='border mt-3 py-2 bg-primary hover:bg-primary-hover text-white rounded'
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default AllUsers
