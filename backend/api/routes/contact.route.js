import express from 'express'
import {
  clearAllContacts,
  clearContactsWithUser,
  clearContactsWithoutUser,
  createContact,
  deleteSingleContact,
  getAllContacts,
  getAllContactsWithNoUser,
  getAllContactsWithUser,
  getContactById,
  getContactsByUserId,
} from '../controllers/contact.controller.js'

const router = express.Router()

router.post('/', createContact)
router.get('/', getAllContacts)
router.delete('/', clearAllContacts)
router.delete('/:contactId', deleteSingleContact)
router.delete('/users/clear', clearContactsWithUser)

router.get('/guest', getAllContactsWithNoUser)
router.delete('/guest/clear', clearContactsWithoutUser)
router.get('/guest/:contactId', getContactById)

router.get('/users', getAllContactsWithUser)
router.get('/users/:userId', getContactsByUserId)

export default router
