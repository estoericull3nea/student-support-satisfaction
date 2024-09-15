// export const formatDate = (isoString) => {
//   const date = new Date(isoString)

//   // Extracting components
//   const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Month is zero-based, so +1
//   const day = String(date.getUTCDate()).padStart(2, '0')
//   const year = date.getUTCFullYear()

//   let hours = date.getUTCHours()
//   const minutes = String(date.getUTCMinutes()).padStart(2, '0')
//   const seconds = String(date.getUTCSeconds()).padStart(2, '0')

//   // Convert to 12-hour format and determine AM or PM
//   const ampm = hours >= 12 ? 'PM' : 'AM'
//   hours = hours % 12 || 12 // Convert to 12-hour format, if 0 set to 12

//   // Format the date and time
//   return `${month}/${day}/${year} ${String(hours).padStart(
//     2,
//     '0'
//   )}:${minutes}:${seconds} ${ampm}`
// }

export const formatTime = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3, // milliseconds
    hour12: true, // 12-hour format
  }

  return new Date(date).toLocaleString('en-US', options)
}
