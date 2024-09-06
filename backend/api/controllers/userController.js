import User from '../model/User.js'
import bcrypt from 'bcryptjs'

export const getAllUsers = async (req, res) => {
  let users
  try {
    // finding all users
    users = await User.find()
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }

  // ======================= Validations =======================
  if (users.length < 1) {
    return res.status(404).json({ message: 'No Users Found' })
  }

  return res.status(200).json({
    count: users.length,
    users,
  })
}

// Registering User
export const registerUser = async (req, res) => {
  // Extracting fields from the request body
  const { firstName, lastName, email, password } = req.body

  try {
    // Check if the user already exists
    let thisUser = await User.findOne({ email })

    if (thisUser) {
      return res.status(409).json({ message: 'User Already Exists' })
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user instance
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

    // Save the user to the database
    await user.save()

    // Return success response
    return res.status(201).json({
      message: 'User Registered Successfully',
      user,
    })
  } catch (error) {
    // Error handling
    return res.status(500).json({ message: 'Server Error: ' + error.message })
  }
}

export const loginUser = async (req, res) => {
  // getting from body
  const { email, password } = req.body

  let thisUser

  try {
    thisUser = await User.findOne({ email })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }

  // checking if this user is registered
  if (!thisUser) {
    return res.status(404).json({ message: "Could'nt Find User by this Email" })
  }

  // comparing password
  const isPasswordCorrect = bycrypt.compareSync(password, thisUser.password)

  //checking if password is correcet
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Incorrect Password' })
  }

  return res.status(200).json({
    message: 'Login Successfull',
    thisUser,
  })
}
