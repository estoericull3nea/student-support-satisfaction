import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import axios from 'axios'

const FeedbacksByAllServicesInOne = () => {
  const [period, setPeriod] = useState('daily')
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })

  useEffect(() => {
    const fetchFeedbackStats = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_DEV_BACKEND_URL
          }/api/analytics/feedback-services-stats?period=${period}`
        )
        const feedbackStats = response.data

        const services = [
          'Library',
          'Office of the School Principal',
          'Office of the School Administrator',
          'Office of the Registrar',
        ]
        const labels = [...new Set(feedbackStats.map((item) => item._id.date))]

        const datasets = services.map((service) => {
          const serviceData = labels.map((label) => {
            const entry = feedbackStats.find(
              (item) =>
                item._id.serviceName === service && item._id.date === label
            )
            return entry ? entry.count : 0
          })

          return {
            label: service,
            data: serviceData,
            fill: false,
            borderColor: getRandomColor(),
          }
        })

        setChartData({
          labels,
          datasets,
        })
      } catch (error) {
        console.error('Error fetching feedback stats:', error)
      }
    }

    fetchFeedbackStats()
  }, [period])

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  return (
    <div className='mt-5'>
      <h2>Student Feedback Chart (Count)</h2>

      <div className='mb-4'>
        <label className='block mb-2 text-sm font-bold'>Select Period</label>
        <select
          className='select select-bordered w-full max-w-xs'
          onChange={(e) => setPeriod(e.target.value)}
          value={period}
        >
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
          <option value='yearly'>Yearly</option> {/* Added yearly option */}
        </select>
      </div>

      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              title: { display: true, text: 'Date' },
            },
            y: {
              title: { display: true, text: 'Feedback Count' },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  )
}

export default FeedbacksByAllServicesInOne
