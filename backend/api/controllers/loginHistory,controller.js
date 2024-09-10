import loginHistoryModel from '../models/loginHistory.model'

export const getAllLogins = async (req, res) => {
  res.send('Get all')
}

export const getLoginHistoryById = async (req, res) => {
  res.send('Get single')
}

export const deleteLoginHistoryById = async (req, res) => {
  res.send('Delete single')
}

export const clearLoginHistory = async (req, res) => {
  res.send('Clear')
}
