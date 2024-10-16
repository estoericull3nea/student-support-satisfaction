import React, { useEffect, useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { toast } from 'react-hot-toast'
import { Calendar } from 'primereact/calendar'

import { Link } from 'react-router-dom'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { formatTime } from '../../utils'

import { io } from 'socket.io-client'
const socket = io('http://localhost:5000')

const StudentsQueryPage = () => {
  const [studentsQuery, setStudentsQuery] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const errorShownRef = useRef(false)

  const fetchStudentsQueries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/contacts/users`
      )
      setStudentsQuery(response.data)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (!errorShownRef.current) {
          toast.error('No queries found.')
          errorShownRef.current = true
        }
        setStudentsQuery([])
      } else {
        toast.error(error.response?.data?.message || 'An error occurred')
      }
    }
  }

  useEffect(() => {
    fetchStudentsQueries()

    socket.on('newContact', (newFeedback) => {
      setStudentsQuery((prevFeedbacks) => [newFeedback, ...prevFeedbacks])
    })

    return () => {
      socket.off('newContact')
    }
  }, [])

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value)
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
          className='p-button-info border p-2 text-[.7rem] rounded'
          onClick={() => viewUserDetails(rowData)}
          style={{ marginRight: '.5em' }}
        />

        <Button
          label='Delete'
          icon='pi pi-trash'
          className='p-button-danger border p-2 text-[.7rem] rounded'
          onClick={() => deleteContact(rowData._id)}
        />
      </div>
    )
  }

  const dateBodyTemplate = (rowData) => {
    return formatTime(rowData.createdAt)
  }

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value)}
        dateFormat='yy-mm-dd'
        placeholder='Filter by Date Commented'
        className='text-xs p-2'
      />
    )
  }

  const filterDate = (value, filter) => {
    if (!filter) return true

    const filterDate = new Date(filter)
    const valueDate = new Date(value)

    return (
      valueDate.getUTCFullYear() === filterDate.getUTCFullYear() &&
      valueDate.getUTCMonth() === filterDate.getUTCMonth() &&
      valueDate.getUTCDate() === filterDate.getUTCDate()
    )
  }

  const deleteContact = async (contactId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/contacts/${contactId}`
      )
      toast.success('Contact deleted successfully')
      fetchStudentsQueries()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting contact')
    }
  }

  // Clear all contacts function
  const clearAllContacts = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_PROD_BACKEND_URL}/api/contacts/users/clear`
      )
      toast.success('All contacts cleared successfully')
      fetchStudentsQueries()
      setShowConfirm(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error clearing contacts')
    }
  }

  const handleConfirmClear = () => {
    setShowConfirm(true)
  }

  const hideModal = () => {
    setShowConfirm(false)
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
          <li>Students Queries</li>
        </ul>
      </div>

      <div className='text-end'>
        <Button
          label='Clear All Students Messages'
          icon='pi pi-trash'
          className='p-button-danger my-3 border text-sm p-2 rounded'
          onClick={handleConfirmClear}
        />
      </div>

      {/* Modal Confirmation */}
      <Dialog
        header='Confirm Clear'
        visible={showConfirm}
        style={{ width: '350px' }}
        footer={
          <div className='space-x-2'>
            <Button
              label='No'
              icon='pi pi-times'
              className='p-button-text border p-2 text-[.7rem] rounded'
              onClick={hideModal}
            />
            <Button
              label='Yes'
              icon='pi pi-check'
              className='p-button-danger border p-2 text-[.7rem] rounded'
              onClick={clearAllContacts}
            />
          </div>
        }
        onHide={hideModal}
      >
        <p>Are you sure you want to clear all students' messages?</p>
      </Dialog>

      <div className='p-inputgroup my-3'>
        <InputText
          value={globalFilter}
          onChange={onGlobalFilterChange}
          placeholder='Search anything...'
          className='text-xs p-3 border'
        />
      </div>

      <DataTable
        value={studentsQuery}
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
          field='message'
          header='Message'
          sortable
          filter
          filterPlaceholder='Filter by Comment'
        />
        <Column
          field='createdAt'
          header='Date Message'
          sortable
          filter
          filterMatchMode='custom'
          filterFunction={filterDate}
          filterElement={dateFilterTemplate}
          body={dateBodyTemplate}
          filterPlaceholder='Filter by Date Commented'
        />

        <Column header='Actions' body={actionBodyTemplate} />
      </DataTable>

      <Dialog
        header='Query Details'
        visible={isDialogVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => setIsDialogVisible(false)}
      >
        {selectedUser && (
          <div>
            <h1 className='font-medium'>Message Details</h1>
            <hr className='mt-1' />
            {/* <p>
              <strong>Message ID:</strong> {selectedUser._id}
            </p> */}
            <p>
              <strong>Message:</strong> {selectedUser.message}
            </p>
            <p>
              <strong>Date Message:</strong>{' '}
              {formatTime(selectedUser.createdAt)}
            </p>
            <br />
            <h1 className='font-medium'>Student Details</h1>
            <hr className='mt-1' />
            <p>
              <strong>Student ID:</strong> {selectedUser.owner._id}
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
              <strong>Active:</strong>{' '}
              {selectedUser.owner.active ? 'Active' : 'Not Active'}
            </p>
            <p>
              <strong>Verified:</strong>{' '}
              {selectedUser.owner.isVerified ? 'Verified' : 'Not Verified'}
            </p>
            <p>
              <strong>Registered At:</strong>{' '}
              {new Date(selectedUser.owner.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{' '}
              {new Date(selectedUser.owner.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default StudentsQueryPage
