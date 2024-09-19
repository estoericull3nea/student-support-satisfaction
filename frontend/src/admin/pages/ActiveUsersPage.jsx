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

const ActiveUsersPage = () => {
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

  const errorShownRef = useRef(false)

  const fetchActiveUsers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/users/active-users'
      )
      setInactiveUsers(response.data)
      errorShownRef.current = false
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (!errorShownRef.current) {
          toast.error('No active users found.')
          errorShownRef.current = true
        }
        setInactiveUsers([])
      } else {
        toast.error(error.response?.data?.message || 'An error occurred')
      }
    }
  }

  useEffect(() => {
    fetchActiveUsers()
  }, [])

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value)
  }

  const makeUserInactive = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/users/${id}/inactive`
      )
      const updatedUser = response.data.data
      setInactiveUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      )
      toast.success('Updated')
      fetchActiveUsers()
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
        `http://localhost:5000/api/users/${_id}`,
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
      fetchActiveUsers()
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

        {rowData.active && (
          <Button
            label='Make Inactive'
            icon='pi pi-times'
            className='p-button-danger border p-2 text-[.7rem] rounded'
            onClick={() => makeUserInactive(rowData._id)}
            style={{ marginRight: '.5em' }}
          />
        )}

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
          <li>Active Users</li>
        </ul>
      </div>

      <div className='p-inputgroup my-3'>
        <span className='p-inputgroup-addon'>Search</span>
        <InputText
          value={globalFilter}
          onChange={onGlobalFilterChange}
          placeholder='Search...'
          className='text-xs'
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
        header='User Details'
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

export default ActiveUsersPage
