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
