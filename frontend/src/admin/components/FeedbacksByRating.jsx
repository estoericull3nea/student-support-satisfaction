// src/components/ServiceRatingChart.js
import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import axios from 'axios'

const FeedbacksByRating = ({ trigger }) => {
  const [period, setPeriod] = useState('daily')
  const [chartData, setChartData] = useState({})

  // Fetch the data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_PROD_BACKEND_URL
          }/api/analytics/ratings/data?period=${period}`
        )

        const services = [
          'Library',
          'Office of the School Principal',
          'Office of the School Administrator',
          'Office of the Registrar',
        ]

        // Extract unique labels (time points)
        const labels = Array.from(new Set(data.map((item) => item._id.time)))

        // Process data to create datasets for each service
        const datasets = services.map((service) => {
          return {
            label: service,
            data: labels.map((label) => {
              const feedback = data.find(
                (fb) => fb._id.serviceName === service && fb._id.time === label
              )
              return feedback ? feedback.averageRating : 0
            }),
            fill: false,
            borderColor: getRandomColor(),
          }
        })

        // Update chart data state
        setChartData({
          labels,
          datasets,
        })
      } catch (error) {
        console.error('Failed to fetch chart data', error)
      }
    }

    fetchData()
  }, [period, trigger])

  // Function to generate random colors for each dataset line
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }

  return (
    <div className='w-full p-4'>
      <h2>Student Feedback Chart (Rating)</h2>
      <div className=' justify-center mb-6'>
        <label className='block mb-2 text-sm font-bold'>Select Period</label>

        <select
          className='select select-bordered w-full max-w-xs'
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
          <option value='yearly'>Yearly</option>
        </select>
      </div>

      <div className='chart-container'>
        {chartData.labels ? (
          <Line
            data={chartData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Average Rating',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Time Period',
                  },
                },
              },
            }}
          />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  )
}

export default FeedbacksByRating
