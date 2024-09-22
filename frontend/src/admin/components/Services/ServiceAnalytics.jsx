import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Pie } from 'react-chartjs-2'
import 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels' // Import the plugin
import { Chart } from 'chart.js'

Chart.register(ChartDataLabels) // Register the plugin

const LibraryAnalytics = ({ serviceName }) => {
  const [chartData, setChartData] = useState(null)
  const [selectedOption, setSelectedOption] = useState('daily') // Default to daily

  useEffect(() => {
    const fetchFeedbackStats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/analytics/feedback-stats/${serviceName}`
        )
        const data = response.data

        // Process data for charting
        const processedData = {
          daily: {
            labels: data.daily.map((d) => d._id), // dates
            datasets: [
              {
                label: 'Daily Feedbacks',
                data: data.daily.map((d) => d.count), // feedback counts
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                ],
                hoverBackgroundColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
              },
            ],
          },
          weekly: {
            labels: data.weekly.map((d) => d._id), // week numbers
            datasets: [
              {
                label: 'Weekly Feedbacks',
                data: data.weekly.map((d) => d.count),
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                ],
                hoverBackgroundColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
              },
            ],
          },
          monthly: {
            labels: data.monthly.map((d) => d._id), // months
            datasets: [
              {
                label: 'Monthly Feedbacks',
                data: data.monthly.map((d) => d.count),
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                ],
                hoverBackgroundColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
              },
            ],
          },
        }

        setChartData(processedData)
      } catch (error) {
        console.error('Failed to fetch data', error)
      }
    }

    fetchFeedbackStats()
  }, [serviceName])

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value)
  }

  if (!chartData) return <div>Loading...</div>

  const options = {
    plugins: {
      datalabels: {
        color: '#fff', // Set the color of the labels
        display: 'auto',
        align: 'center',
        anchor: 'center',
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex]
          return `${label}: ${value}` // Display date and count inside the pie chart
        },
      },
    },
  }

  return (
    <div>
      <div className='form-control w-full max-w-xs'>
        <label className='label'>
          <span className='label-text'>Select Time Period</span>
        </label>
        <select
          className='select select-bordered'
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
        </select>
      </div>

      <div>
        {selectedOption === 'daily' && (
          <>
            <h2 className='my-3 text-sm'>
              Daily Feedbacks for{' '}
              <span className='font-bold'>{serviceName}</span>
            </h2>
            <Pie data={chartData.daily} options={options} />
          </>
        )}
        {selectedOption === 'weekly' && (
          <>
            <h2 className='my-3 text-sm'>
              Weekly Feedbacks for{' '}
              <span className='font-bold'>{serviceName}</span>
            </h2>
            <Pie data={chartData.weekly} options={options} />
          </>
        )}
        {selectedOption === 'monthly' && (
          <>
            <h2 className='my-3 text-sm'>
              Monthly Feedbacks for{' '}
              <span className='font-bold'>{serviceName}</span>
            </h2>
            <Pie data={chartData.monthly} options={options} />
          </>
        )}
      </div>
    </div>
  )
}

export default LibraryAnalytics
