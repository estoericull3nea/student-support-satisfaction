// utils/formatTime.js

export const formatLoginTime = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3, // for milliseconds
    hour12: true, // 24-hour format
  }

  return new Date(date).toLocaleString('en-US', options)
}
