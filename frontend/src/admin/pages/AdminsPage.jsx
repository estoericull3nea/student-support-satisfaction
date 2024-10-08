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

const AdminsPage = () => {
  const [fetchAdmin, setFetchAdmin] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isUpdateDialogVisible, setIsUpdateDialogVisible] = useState(false)
  const [updatedAdminDetails, setUpdatedAdminDetails] = useState({
    username: '',
    password: '',
  })

  const [isAddAdminDialogVisible, setIsAddAdminDialogVisible] = useState(false)
  const [newAdminDetails, setNewAdminDetails] = useState({
    username: '',
    password: '',
  })

  const errorShownRef = useRef(false)

  const openRegisterAdminModal = () => {
    setIsAddAdminDialogVisible(true)
  }

  const handleAddAdmin = async () => {
    if (!newAdminDetails.username) {
      toast.error('Username is required')
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/register`,
        newAdminDetails
      )
      const addedAdmin = response.data.newAdmin
      console.log(response.data)
      setFetchAdmin((prevAdmin) => [...prevAdmin, addedAdmin])
      toast.success('Admin added successfully')
      setIsAddAdminDialogVisible(false)
      setNewAdminDetails({
        username: '',
        password: '',
      })
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/get-all-admins`
      )
      setFetchAdmin(response.data)
      errorShownRef.current = false
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (!errorShownRef.current) {
          toast.error('No Admins found.')
          errorShownRef.current = true
        }
        setFetchAdmin([])
      } else {
        toast.error(error.response?.data?.message || 'An error occurred')
      }
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value)
  }

  const viewUserDetails = (rowData) => {
    setSelectedAdmin(rowData)
    setIsDialogVisible(true)
  }

  const openUpdateDialog = (rowData) => {
    setSelectedAdmin(rowData)
    setUpdatedAdminDetails({
      username: rowData.username,
      password: '',
    })
    setIsUpdateDialogVisible(true)
  }

  const handleUpdateAdmin = async () => {
    if (!updatedAdminDetails.username) {
      toast.error('Username is required')
      return
    }

    try {
      console.log(updatedAdminDetails)
      const { _id } = selectedAdmin
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/update-admin/${_id}`,
        updatedAdminDetails
      )
      toast.success('Admin updated successfully')
      setIsUpdateDialogVisible(false)
      fetchAdmins()
    } catch (error) {
      console.log(error.response)
      if (error.response.data.message === 'Username already exists') {
        toast.error('Username already exists')
      }
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
          <li>Admins</li>
        </ul>
      </div>

      {/* Add Admin Button */}
      <div className='text-end'>
        <Button
          label='Register Admin'
          icon='pi pi-plus'
          className='p-button-success my-3 border text-sm p-2 rounded'
          onClick={openRegisterAdminModal}
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
        value={fetchAdmin}
        paginator
        rows={10}
        globalFilter={globalFilter}
        className='text-xs'
        stateStorage='session'
        stateKey='dt-state-demo-session'
      >
        <Column
          field='username'
          header='Username'
          sortable
          filter
          filterPlaceholder='Filter by Username'
        />

        <Column
          field='role'
          header='Role'
          sortable
          filter
          filterPlaceholder='Filter by Role'
        />

        <Column
          field='createdAt'
          header='Registered At'
          sortable
          filter
          filterPlaceholder='Filter by Registered At'
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
        {selectedAdmin && (
          <div>
            <p>
              <strong>ID:</strong> {selectedAdmin._id}
            </p>
            <p>
              <strong>Username:</strong> {selectedAdmin.username}
            </p>
            <p>
              <strong>Role:</strong> {selectedAdmin.role}
            </p>
            <p>
              <strong>Registered At:</strong>{' '}
              {new Date(selectedAdmin.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{' '}
              {new Date(selectedAdmin.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog
        header='Add New Admin'
        visible={isAddAdminDialogVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => setIsAddAdminDialogVisible(false)}
      >
        <div className='p-fluid'>
          <div className='flex gap-x-3'>
            <div className='p-field'>
              <div className='label'>
                <label htmlFor='username'>Username</label>
              </div>
              <InputText
                id='firstName'
                value={newAdminDetails.username}
                className='input input-bordered w-full input-sm'
                placeholder='Type here'
                onChange={(e) =>
                  setNewAdminDetails({
                    ...newAdminDetails,
                    username: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className='p-field'>
              <div className='label'>
                <label htmlFor='password'>Password</label>
              </div>

              <InputText
                id='password'
                type='password'
                className='input input-bordered w-full input-sm'
                placeholder='Type here'
                value={newAdminDetails.password}
                onChange={(e) =>
                  setNewAdminDetails({
                    ...newAdminDetails,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className='p-field'>
            <Button
              label='Register Admin'
              onClick={handleAddAdmin}
              className='border mt-3 py-2 bg-primary hover:bg-primary-hover text-white rounded'
            />
          </div>
        </div>
      </Dialog>

      {/* Update User Dialog */}
      <Dialog
        header='Update Admin'
        visible={isUpdateDialogVisible}
        style={{ width: '400px' }}
        modal
        onHide={() => setIsUpdateDialogVisible(false)}
        className='text-sm'
      >
        <div className='p-fluid'>
          <div className='p-field'>
            <div className='label'>
              <label htmlFor='username'>Username</label>
            </div>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered w-full  input-sm'
              id='username'
              value={updatedAdminDetails.username}
              onChange={(e) =>
                setUpdatedAdminDetails({
                  ...updatedAdminDetails,
                  username: e.target.value,
                })
              }
              required
            />
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
              value={updatedAdminDetails.password}
              onChange={(e) =>
                setUpdatedAdminDetails({
                  ...updatedAdminDetails,
                  password: e.target.value,
                })
              }
            />
          </div>

          <div className='p-field'>
            <Button
              label='Update'
              onClick={handleUpdateAdmin}
              className='border mt-3 py-2 bg-primary hover:bg-primary-hover text-white rounded'
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default AdminsPage
