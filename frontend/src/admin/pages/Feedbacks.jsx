import React, { useEffect, useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import ServiceAnalytics from '../components/Services/ServiceAnalytics.jsx'
import FeedbacksByAllServicesInOne from '../components/FeedbacksByAllServicesInOne.jsx'
import FeedbacksByRating from '../components/FeedbacksByRating.jsx'

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
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

  const fetchAllFeedbacks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/feedbacks`
      )
      setFeedbacks(response.data)
      errorShownRef.current = false
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (!errorShownRef.current) {
          toast.error('No feedbacks found.')
          errorShownRef.current = true
        }
        setFeedbacks([])
      } else {
        toast.error(error.response?.data?.message || 'An error occurred')
      }
    }
  }

  useEffect(() => {
    fetchAllFeedbacks()
  }, [])

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value)
  }

  const viewFeedbackDetails = (rowData) => {
    setSelectedFeedback(rowData)
    setIsDialogVisible(true)
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          label='View'
          icon='pi pi-eye'
          className='p-button-info border p-2 text-[.7rem] rounded'
          onClick={() => viewFeedbackDetails(rowData)}
          style={{ marginRight: '.5em' }}
        />

        {/* <Button
          label='Update'
          icon='pi pi-pencil'
          className='p-button-warning border p-2 text-[.7rem] rounded'
          onClick={() => openUpdateDialog(rowData)}
        /> */}
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
          <li>All Feedbacks</li>
        </ul>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2'>
        <FeedbacksByAllServicesInOne />
        <FeedbacksByRating />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-4 mt-10'>
        <ServiceAnalytics serviceName='Library' />
        <ServiceAnalytics serviceName='Office of the School Principal' />
        <ServiceAnalytics serviceName='Office of the School Administrator' />
        <ServiceAnalytics serviceName='Office of the Registrar' />
      </div>

      <div className='p-inputgroup my-10'>
        <InputText
          value={globalFilter}
          onChange={onGlobalFilterChange}
          placeholder='Search anything...'
          className='text-xs border p-3'
        />
      </div>

      <DataTable
        value={feedbacks}
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
          header='Feedback At'
          sortable
          filter
          filterPlaceholder='Filter by Feedback At'
        />

        <Column header='Actions' body={actionBodyTemplate} />
      </DataTable>

      <Dialog
        header='Feedback Details'
        visible={isDialogVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => setIsDialogVisible(false)}
      >
        {console.log(selectedFeedback)}
        {selectedFeedback && (
          <div>
            <h1 className='font-medium'>Feedback Details</h1>
            <hr className='mt-1' />
            <p>
              <strong>Feedback ID:</strong> {selectedFeedback._id}
            </p>
            <p>
              <strong>Service Name:</strong> {selectedFeedback.serviceName}
            </p>

            <p>
              <strong>Comment:</strong> {selectedFeedback.comment}
            </p>

            <p>
              <strong>Rating:</strong> {selectedFeedback.rating}
            </p>

            <p>
              <strong>Feedback At:</strong>{' '}
              {new Date(selectedFeedback.createdAt).toLocaleString()}
            </p>
          </div>
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
          {/* 
          <div className='p-field'>
            <Button
              label='Update'
              onClick={handleUpdateUser}
              className='border mt-3 py-2 bg-primary hover:bg-primary-hover text-white rounded'
            />
          </div> */}
        </div>
      </Dialog>
    </div>
  )
}

export default Feedbacks
