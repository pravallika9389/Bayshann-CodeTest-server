var utils = require('../models/utilities');
var errors = require('../security/errors');

var BayshannService = require('../services/bayshann-service');

//jshint unused:false
exports.getUniqueCourses = (req, res) => {
  BayshannService.getUniqueCourses()
  .then(uniqueCourses => {
    return res.status(200).send(uniqueCourses).end();
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err).end();
  });
};

//jshint unused:false
exports.getListOfStudents = (req, res) => {
  BayshannService.getListOfStudentsByCourses()
  .then(students => {
    return res.status(200).send(students).end();
  })
  .catch(err => {
    console.error('Err: %s', JSON.stringify(err));
    return res.status(err.code).send(err).end();
  });
};
