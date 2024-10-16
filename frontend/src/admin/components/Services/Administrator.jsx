import React, { useEffect, useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import ServiceAnalytics from './ServiceAnalytics'

import ViewServiceVists from '../ViewServiceVists'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const Admnistrator = () => {
  const [inactiveUsers, setLibraryService] = useState([])
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

  // Function to open "Add User" dialog
  const openAddUserDialog = () => {
    setIsAddUserDialogVisible(true)
  }

  // Function to handle adding a user
  const handleAddUser = async () => {
    if (
      !newUserDetails.firstName ||
      !newUserDetails.lastName ||
      !newUserDetails.email ||
      !newUserDetails.password
    ) {
      toast.error('All fields are required')
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/api/users/add-user`,
        newUserDetails
      )
      const addedUser = response.data.newUser
      setLibraryService((prevUsers) => [...prevUsers, addedUser])
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

  const fetchLibraryService = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_DEV_BACKEND_URL
        }/api/feedbacks/get-service/Office of the School Administrator`
      )
      setLibraryService(response.data)
      errorShownRef.current = false
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (!errorShownRef.current) {
          toast.error('No active students found.')
          errorShownRef.current = true
        }
        setLibraryService([])
      } else {
        toast.error(error.response?.data?.message || 'An error occurred')
      }
    }
  }

  useEffect(() => {
    fetchLibraryService()
  }, [])

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value)
  }

  const makeUserInactive = async (id) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_DEV_BACKEND_URL}/api/users/${id}/inactive`
      )
      const updatedUser = response.data.data
      setLibraryService((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      )
      toast.success('Updated')
      fetchLibraryService()
    } catch (error) {
      console.error('Error making user active:', error)
    }
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
        `${import.meta.env.VITE_DEV_BACKEND_URL}/api/users/${_id}`,
        updatedUserDetails
      )
      const updatedUser = response.data.updatedUser
      setLibraryService((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      )
      toast.success('User updated successfully')
      setIsUpdateDialogVisible(false)
      fetchLibraryService()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    }
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          label='View'
          icon='pi pi-eye'
          className='p-button-info border p-2 text-[.7rem] rounded'
          onClick={() => viewUserDetails(rowData)}
          style={{ marginRight: '.5em' }}
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
          <li>Office of the School Administrator</li>
        </ul>
      </div>

      <ViewServiceVists serviceName='Office of the School Administrator' />

      <div className='my-10 w-[30rem]'>
        <ServiceAnalytics serviceName='Office of the School Administrator' />
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
          field='serviceName'
          header='Service Name'
          sortable
          filter
          filterPlaceholder='Filter by Service Name'
        />
        <Column
          field='comment'
          header='Comment'
          sortable
          filter
          filterPlaceholder='Filter by Comment'
        />
        <Column
          field='rating'
          header='Rating'
          sortable
          filter
          filterPlaceholder='Filter by Rating'
        />
        <Column
          field='user.email'
          header='Student Email'
          sortable
          filter
          filterPlaceholder='Filter by Student Email'
        />
        <Column
          field='createdAt'
          header='Feedback Date'
          sortable
          filter
          filterPlaceholder='Filter by Status'
        />

        <Column header='Actions' body={actionBodyTemplate} />
      </DataTable>

      <Dialog
        header='Feedback Service'
        visible={isDialogVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => setIsDialogVisible(false)}
      >
        {selectedUser && (
          <div>
            <h1 className='font-medium'>Feedback Details</h1>
            <hr className='mt-1' />
            <p>
              <strong>Feedback ID:</strong> {selectedUser._id}
            </p>
            <p>
              <strong>Service Name:</strong> {selectedUser.serviceName}
            </p>
            <p>
              <strong>Comment:</strong> {selectedUser.comment}
            </p>
            <p>
              <strong>Rating:</strong> {selectedUser.rating}
            </p>
            <p>
              <strong>Feedback Date:</strong> {selectedUser.createdAt}
            </p>

            <h1 className='font-medium mt-3'>Student Details</h1>
            <hr className='mt-1' />

            <p>
              <strong>First Name:</strong> {selectedUser.user.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedUser.user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
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

      {/* Add User Dialog */}
      <Dialog
        header='Add New User'
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
              onClick={handleAddUser}
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

export default Admnistrator
