import Contact from '../models/contact.model.js'

export const createContact = async (req, res) => {
  const { firstName, lastName, email, message, userId } = req.body
  try {
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      message,
      owner: userId,
    })

    await newContact.save()

    res.status(201).json({ message: 'Contact form submitted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error submitting contact form', error })
  }
}

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().populate('owner')

    if (!contacts.length) {
      return res.status(404).json({ message: 'No contacts Found' })
    }

    res.status(200).json(contacts)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error })
  }
}

export const getAllContactsWithNoUser = async (_, res) => {
  try {
    const contacts = await Contact.find({ owner: null }, '-owner')

    res.status(200).json(contacts)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching contacts with no user', error })
  }
}

export const getAllContactsWithUser = async (_, res) => {
  try {
    const contacts = await Contact.find({ owner: { $ne: null } }).populate(
      'owner'
    )

    res.status(200).json(contacts)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching contacts with users', error })
  }
}

export const getContactsByUserId = async (req, res) => {
  const { userId } = req.params

  try {
    const contacts = await Contact.find({ owner: userId })
      .populate('owner')
      .sort({ createdAt: -1 })

    res.status(200).json(contacts)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts for user', error })
  }
}

export const getContactById = async (req, res) => {
  const { contactId } = req.params

  try {
    const contact = await Contact.findById(contactId).populate('userId')

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }

    res.status(200).json(contact)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error })
  }
}

export const clearAllContacts = async (_, res) => {
  try {
    await Contact.deleteMany({})
    res
      .status(200)
      .json({ message: 'All contacts have been cleared successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error clearing contacts', error })
  }
}

export const clearContactsWithoutUser = async (_, res) => {
  try {
    await Contact.deleteMany({ owner: null })

    res.status(200).json({
      message: 'All contacts without a user have been cleared successfully',
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error clearing contacts without a user', error })
  }
}

export const clearContactsWithUser = async (_, res) => {
  try {
    await Contact.deleteMany({
      owner: { $exists: true, $ne: null },
    })

    res.status(200).json({
      message: 'All contacts with a user have been cleared successfully',
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error clearing contacts with a user', error })
  }
}

export const deleteSingleContact = async (req, res) => {
  const { contactId } = req.params

  try {
    const contact = await Contact.findByIdAndDelete(contactId)

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' })
    }

    res.status(200).json({ message: 'Contact deleted successfully', contact })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error })
  }
}
