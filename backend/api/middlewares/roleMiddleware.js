export const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const { user } = req
    console.log(user)
    if (user && user.role === requiredRole) {
      next()
    } else {
      return res.status(403).json({ message: 'Access denied' })
    }
  }
}
