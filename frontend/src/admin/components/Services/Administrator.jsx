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

import { io } from 'socket.io-client'
const socket = io(import.meta.env.VITE_PROD_BACKEND_URL)

const Admnistrator = () => {
  const [inactiveUsers, setAdministratorService] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [trigger, setTrigger] = useState(0)

  const fetchAdministratorService = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PROD_BACKEND_URL
        }/api/feedbacks/get-service/Office of the School Administrator`
      )
      setAdministratorService(response.data)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAdministratorService([])
      } else {
        toast.error(error.response?.data?.message || 'An error occurred')
      }
    }
  }

  useEffect(() => {
    fetchAdministratorService()

    socket.on('newFeedback', (newFeedback) => {
      console.log('New feedback received via Socket.IO:', newFeedback)

      setAdministratorService((prevFeedbacks) => [
        newFeedback,
        ...prevFeedbacks,
      ])
      setTrigger((prevTrigger) => prevTrigger + 1)
    })

    socket.on('newOfficeVisited', (data) => {
      console.log('New office visited received via Socket.IO:', data)

      setTrigger((prevTrigger) => prevTrigger + 1)
    })

    return () => {
      socket.off('newFeedback')
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

      <ViewServiceVists
        trigger={trigger}
        serviceName='Office of the School Administrator'
      />

      <div className='my-10 w-[30rem]'>
        <ServiceAnalytics
          trigger={trigger}
          serviceName='Office of the School Administrator'
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
          </div>
        )}
      </Dialog>
    </div>
  )
}

export default Admnistrator
