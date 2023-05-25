const cron = require('node-cron');
const axios = require('axios');
const Schedule = require('./models/Schedule');


let jobs = {};

class ScheduleFacade {
  
  static createCronJob(id, source, destination, cronSchedule) {
    console.log("estou no create wwwwwcron")
    console.log(cronSchedule);
    let job = cron.schedule(cronSchedule, () => {
      axios.get(source)
        .then(response => {
          axios.post(destination, response.data);
        })
        .catch(err => {
          console.error(`Error during data ingestion for job ${id}: ${err}`);
        });
    });

    return job;
  }

  static createSchedule({source, destination, cronSchedule}, callback) {
    Schedule.create({ source, destination, cronSchedule }, function(err) {
      if (err) {
        return callback(err);
      }

      // Crie um novo job cron
      console.log("ants3333");
      console.log(ScheduleFacade.createSchedule('','',''))
      
      let job = this.createCronJob('00001', source, destination, cronSchedule);

      jobs[this.lastID] = job;

      callback(null, this.lastID);
    });
  }

  static findAllSchedules(callback) {
    Schedule.findAll(callback);
  }

  static deleteSchedule(id, callback) {
    Schedule.delete(id, function(err) {
      if (err) {
        return callback(err);
      }

      if (jobs[id]) {
        jobs[id].destroy();
        delete jobs[id];
      }

      callback(null);
    });
  }
}

module.exports = ScheduleFacade;
