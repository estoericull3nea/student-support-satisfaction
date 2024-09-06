import dotenv from 'dotenv'
import User from '../model/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

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

    // Generate a JWT token
    const token = jwt.sign(
      { id: thisUser._id, email: thisUser.email }, // Payload
      process.env.JWT_SECRET, // Secret key from environment variable
      { expiresIn: '1h' } // Token expiration time
    )

    // Return a success message and user info (without password)
    return res.status(200).json({
      message: 'Login successful',
      token, // The generated JWT token
      user: {
        id: thisUser._id,
        firstName: thisUser.firstName,
        lastName: thisUser.lastName,
        email: thisUser.email,
      },
    })
  } catch (error) {
    // Return an error response in case of failure
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Update User
export const updateUser = async (req, res) => {
  const { id } = req.params // Assuming user ID is passed as a route parameter
  const { firstName, lastName } = req.body

  try {
    // Find the user by ID
    const user = await User.findById(id)

    // If the user does not exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // ======================= Dynamic Field Updates =======================
    // Update the first name if provided
    if (firstName) {
      user.firstName = firstName
    }

    // Update the last name if provided
    if (lastName) {
      user.lastName = lastName
    }

    // Save the updated user
    const updatedUser = await user.save()

    // Return the updated user data, excluding sensitive information
    return res.status(200).json({
      message: 'User updated successfully',
      updatedUser,
    })
  } catch (error) {
    // Error handling
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Delete User
export const deleteUser = async (req, res) => {
  const { id } = req.params // Assuming user ID is passed as a route parameter

  try {
    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(id)

    // If the user does not exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Success response
    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    // Error handling
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// Logout User
export const logoutUser = async (req, res) => {
  try {
    // Extract the token from the authorization header
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(400).json({ message: 'No token provided' })
    }

    // Decode the token to get the expiration time
    const decoded = jwt.decode(token)

    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token' })
    }

    // Save the token in the blacklist with the same expiration as the token
    const blacklistedToken = new Blacklist({
      token,
      expiresAt: new Date(decoded.exp * 1000), // Expiration date in milliseconds
    })

    await blacklistedToken.save()

    return res
      .status(200)
      .json({ message: 'Logout successful, token invalidated' })
  } catch (error) {
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
