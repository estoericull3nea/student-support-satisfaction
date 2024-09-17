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

const InactiveUsersTable = () => {
  const [inactiveUsers, setInactiveUsers] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)

  // useRef to track if the 404 error has been shown
  const errorShownRef = useRef(false)

  const fetchInactiveUsers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/users/not-active-users'
      )
      setInactiveUsers(response.data)
      // Reset the errorShownRef if data is successfully fetched
      errorShownRef.current = false
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Only show the error toast if it hasn't been shown before
        if (!errorShownRef.current) {
          toast.error('No inactive users found.')
          errorShownRef.current = true // Mark that the error has been shown
        }
        setInactiveUsers([]) // Clear the table
      } else {
        toast.error(error.response?.data?.message || 'An error occurred')
      }
    }
  }

  useEffect(() => {
    fetchInactiveUsers()
  }, [])

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value)
  }

  const makeUserActive = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/users/${id}/activate`
      )
      const updatedUser = response.data.data

      setInactiveUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      )

      toast.success('Updated')
      fetchInactiveUsers()
    } catch (error) {
      console.error('Error making user active:', error)
    }
  }

  const viewUserDetails = (rowData) => {
    setSelectedUser(rowData)
    setIsDialogVisible(true)
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          label='View'
          icon='pi pi-eye'
          className='p-button-info'
          onClick={() => viewUserDetails(rowData)}
          style={{ marginRight: '.5em' }}
        />

        {!rowData.active && (
          <Button
            label='Make Active'
            icon='pi pi-check'
            className='p-button-success'
            onClick={() => makeUserActive(rowData._id)}
          />
        )}
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
          <li>Inactive Users</li>
        </ul>
      </div>

      <div className='p-inputgroup my-3'>
        <span className='p-inputgroup-addon'>Search</span>
        <InputText
          value={globalFilter}
          onChange={onGlobalFilterChange}
          placeholder='Search...'
        />
      </div>

      <DataTable
        value={inactiveUsers}
        paginator
        rows={10}
        globalFilter={globalFilter}
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
    </div>
  )
}

export default InactiveUsersTable
