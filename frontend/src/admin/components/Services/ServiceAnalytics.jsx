import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Pie } from 'react-chartjs-2'
import 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Chart } from 'chart.js'

Chart.register(ChartDataLabels)

const LibraryAnalytics = ({ serviceName }) => {
  const [chartData, setChartData] = useState(null)
  const [selectedOption, setSelectedOption] = useState('daily')

  useEffect(() => {
    const fetchFeedbackStats = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/analytics/feedback-stats/${serviceName}`
        )
        const data = response.data

        const processedData = {
          daily: {
            labels: data.daily.map((d) => d._id),
            datasets: [
              {
                label: 'Daily Feedbacks',
                data: data.daily.map((d) => d.count),
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
            labels: data.weekly.map((d) => d._id),
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
            labels: data.monthly.map((d) => d._id),
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
          yearly: {
            labels: data.yearly.map((d) => d._id),
            datasets: [
              {
                label: 'Yearly Feedbacks',
                data: data.yearly.map((d) => d.count),
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
        color: '#fff',
        display: 'auto',
        align: 'center',
        anchor: 'center',
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex]
          return `${label}: ${value}`
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
          <option value='yearly'>Yearly</option> {/* Added yearly option */}
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
        {selectedOption === 'yearly' && (
          <>
            <h2 className='my-3 text-sm'>
              Yearly Feedbacks for{' '}
              <span className='font-bold'>{serviceName}</span>
            </h2>
            <Pie data={chartData.yearly} options={options} />
          </>
        )}
      </div>
    </div>
  )
}

export default LibraryAnalytics
