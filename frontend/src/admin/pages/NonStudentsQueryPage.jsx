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

const NonStudentsQueryPage = () => {
  const [studentsQuery, setStudentsQuery] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)

  const errorShownRef = useRef(false)

  const fetchStudentsQueries = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/contacts/guest'
      )
      setStudentsQuery(response.data)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (!errorShownRef.current) {
          toast.error('No inactive users found.')
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
        dateFormat='yy-mm-dd' // Ensures user picks only the date, not time
        placeholder='Filter by Date Commented'
        className='text-xs p-2'
      />
    )
  }

  const filterDate = (value, filter) => {
    if (!filter) return true // No filter applied, show all records

    const filterDate = new Date(filter) // Date from the Calendar (user selection)
    const valueDate = new Date(value) // Date from the record (createdAt)

    // Strip out the time and compare only the date portion in UTC
    return (
      valueDate.getUTCFullYear() === filterDate.getUTCFullYear() &&
      valueDate.getUTCMonth() === filterDate.getUTCMonth() &&
      valueDate.getUTCDate() === filterDate.getUTCDate()
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
          <li>Students Queries</li>
        </ul>
      </div>

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
          body={dateBodyTemplate} // Display formatted date
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
            <p>
              <strong>Message ID:</strong> {selectedUser._id}
            </p>
            <p>
              <strong>Message:</strong> {selectedUser.message}
            </p>
            <p>
              <strong>Date Message:</strong>{' '}
              {formatTime(selectedUser.createdAt)}
            </p>
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default NonStudentsQueryPage
