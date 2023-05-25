const express = require('express');
const ScheduleFacade = require('../ScheduleFacade');

let router = express.Router();

router.post('/schedule', (req, res) => {
  const {source, destination, cronSchedule} = req.body;

  // Validação de campos necessários
  if (!source || !destination || !cronSchedule) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  ScheduleFacade.createSchedule({ source, destination, cronSchedule }, function(err, id) {
    if (err) {
      return res.status(500).json({ error: 'Error inserting into database' });
    }

    res.status(201).json({ message: `Job scheduled with ID: ${id}` });
  });
});

router.get('/schedule', (req, res) => {
  ScheduleFacade.findAllSchedules(function(err, schedules) {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving schedules from database' });
    }

    res.status(200).json(schedules);
  });
});

router.delete('/schedule/:id', (req, res) => {
  const { id } = req.params;

  ScheduleFacade.deleteSchedule(id, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting schedule from database' });
    }

    res.status(200).json({ message: `Job with ID ${id} was deleted` });
  });
});

module.exports = router;
