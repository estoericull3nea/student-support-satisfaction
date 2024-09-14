export const formatToMMDDYYYY = (dateString) => {
  const date = new Date(dateString)

  // Extract the month, day, and year
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()

  return `${month}/${day}/${year}`
}
