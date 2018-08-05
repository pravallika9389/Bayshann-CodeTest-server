const bodyparser = require('body-parser');
const jsonParser = bodyparser.json();
const bayshann = require('../controllers/bayshann-controller');

const Config = require('../../configuration').configuration;

module.exports = (app) => {
  "use strict";

  app.use(jsonParser);

  app.get('/getUniqueCourses', bayshann.getUniqueCourses);
  app.get('/getListOfStudents', bayshann.getListOfStudents);

  // app.put('/profiles', jsonParser, profiles.changePassword);
};
