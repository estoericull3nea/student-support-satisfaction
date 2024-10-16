import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import axios from 'axios'
import 'chart.js/auto'

const StudentRegistersAnalytics = () => {
  const [chartData, setChartData] = useState(null)
  const [selectedOption, setSelectedOption] = useState('daily')

  useEffect(() => {
    // Fetch registration stats from backend based on the selected option
    const fetchRegistrationStats = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_DEV_BACKEND_URL
          }/api/analytics/user-registration-stats`
        )

        const data = response.data

        // Process data for charting
        const processedData = {
          daily: {
            labels: data.daily.map((d) => d._id), // dates
            datasets: [
              {
                label: 'Students Registered per Day',
                data: data.daily.map((d) => d.count), // user counts
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
              },
            ],
          },
          weekly: {
            labels: data.weekly.map((d) => d._id), // week numbers
            datasets: [
              {
                label: 'Students Registered per Week',
                data: data.weekly.map((d) => d.count), // user counts
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
              },
            ],
          },
          monthly: {
            labels: data.monthly.map((d) => d._id), // months
            datasets: [
              {
                label: 'Students Registered per Month',
                data: data.monthly.map((d) => d.count), // user counts
                borderColor: 'rgba(255, 159, 64, 1)',
                fill: false,
              },
            ],
          },
          yearly: {
            labels: data.yearly.map((d) => d._id), // years
            datasets: [
              {
                label: 'Students Registered per Year',
                data: data.yearly.map((d) => d.count), // user counts
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
              },
            ],
          },
        }

        setChartData(processedData)
      } catch (error) {
        console.error('Failed to fetch data', error)
      }
    }

    fetchRegistrationStats()
  }, []) // Empty dependency array to run once on component mount

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value)
  }

  if (!chartData) return <div>Loading...</div>

  return (
    <div className='shadow-lg p-3 mt-3'>
      <div className='form-control w-full max-w-xs'>
        <label className='label'>
          <span className='label-text'>Select Time Period</span>
        </label>
        <select
          className='select select-bordered'
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value='daily'>Per Day</option>
          <option value='weekly'>Per Week</option>
          <option value='monthly'>Per Month</option>
          <option value='yearly'>Per Year</option> {/* New yearly option */}
        </select>
      </div>

      <div>
        {selectedOption === 'daily' && (
          <>
            <h2>Daily Registrations</h2>
            <Line data={chartData.daily} />
          </>
        )}
        {selectedOption === 'weekly' && (
          <>
            <h2>Weekly Registrations</h2>
            <Line data={chartData.weekly} />
          </>
        )}
        {selectedOption === 'monthly' && (
          <>
            <h2>Monthly Registrations</h2>
            <Line data={chartData.monthly} />
          </>
        )}
        {selectedOption === 'yearly' && (
          <>
            <h2>Yearly Registrations</h2>
            <Line data={chartData.yearly} />
          </>
        )}
      </div>
    </div>
  )
}

export default StudentRegistersAnalytics
