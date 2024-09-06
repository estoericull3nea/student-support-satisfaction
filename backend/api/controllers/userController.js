import User from '../model/User.js'
import bcrypt from 'bcryptjs'

export const getAllUsers = async (req, res) => {
  try {
    // Finding all users, excluding sensitive fields like password
    const users = await User.find().select('-password').lean()

    // Check if no users were found
    if (!users.length) {
      return res.status(404).json({ message: 'No Users Found' })
    }

    // Return user data along with count
    return res.status(200).json({
      count: users.length,
      users,
    })
  } catch (error) {
    // Return server error status in case of failure
    return res.status(500).json({ message: 'Server Error: ' + error.message })
  }
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

// Login User
export const loginUser = async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body

  try {
    // Find the user by email
    const thisUser = await User.findOne({ email })

    // Check if user exists
    if (!thisUser) {
      return res.status(404).json({ message: 'User not found with this email' })
    }

    // Compare the password using bcrypt (asynchronously)
    const isPasswordCorrect = await bcrypt.compare(password, thisUser.password)

    // Check if the password is correct
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect Email or Password' })
    }

    // Return a success message and user info (without password)
    return res.status(200).json({
      message: 'Login successful',
      thisUser,
    })
  } catch (error) {
    // Return an error response in case of failure
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
