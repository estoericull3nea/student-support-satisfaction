import Visit from '../models/visit.model.js'

export const countVisit = async (req, res) => {
  const { serviceName } = req.body

  try {
    let visit = await Visit.findOne({ serviceName })

    if (!visit) {
      visit = new Visit({ serviceName, visitCount: 1 })
    } else {
      visit.visitCount += 1
    }

    await visit.save()

    res.status(200).json({ message: 'Visit counted successfully', visit })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while counting visits' })
  }
}

export const getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find()
    res.status(200).json(visits)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching visits' })
  }
}

export const getVisitById = async (req, res) => {
  const { id } = req.params

  try {
    const visit = await Visit.findById(id)
    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' })
    }
    res.status(200).json(visit)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the visit' })
  }
}

export const getVisitsByServiceName = async (req, res) => {
  const { serviceName } = req.params

  try {
    const visits = await Visit.find({ serviceName })
    if (visits.length === 0) {
      return res.status(404).json({ error: 'No visits found for this service' })
    }
    res.status(200).json(visits)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching visits' })
  }
}
