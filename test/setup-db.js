/*
 * This script is intended to be used by testers or for demo purposes.
 * This script sets up a sample database.
 */
const mongoose = require('mongoose');
const app = require('express')();
const Utils = require('../lib//models/utilities');
const Config = require('../configuration').configuration;
const Subject = require('../lib/models/subject-model').Subject;
const ClassDetails = require('../lib/models/class-details-model').ClassDetails;
const Student = require('../lib/models/student-model').Student;
const CoursesData = require('./resources/output.json');


const opts = { server: { socketOptions: { keepAlive: 1 } } };

var addSubject = (subject) => {
  "use strict";
  return new Promise(
    (resolve, reject) => {
      Subject.findOne({'subject_code': subject.subject_code})
      .then(returnSubject => {
         //  console.log('returnSubject :: %j',returnSubject);
        if (!returnSubject) {
          var S = new Subject(subject);
          // console.log('S :: %j',S);
          return S.save();
        }else{
          return returnSubject;
        }
      }).then(returnS => {
        // console.log('returnS %j',returnS);
        resolve(returnS) ;
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var addClassDetails = (classdetails) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      // console.log('entered into classdetails');
      ClassDetails.findOne({'subject': classdetails.subject, 'week_start_date':classdetails.week_start_date, 'week_end_date':classdetails.week_end_date,'exact_class_date':classdetails.exact_class_date, 'day_of_week':classdetails.day_of_week, 'room_number':classdetails.room_number, 'room':classdetails.room, 'gps_coordinates':classdetails.gps_coordinates, 'start_time':classdetails.start_time, 'end_time':classdetails.end_time, 'campus_code':classdetails.campus_code, 'hasStandardRoomDescription':classdetails.hasStandardRoomDescription, 'duration':classdetails.duration }).exec()
      .then(returnClassdetails => {
        if (!returnClassdetails || returnClassdetails === undefined || returnClassdetails == null) {
          var C = new ClassDetails(classdetails);
         return C.save();
      }else{
        return returnClassdetails;
      }
    }).then(returnC => {
        resolve(returnC) ;
      })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err});
        }
        reject(err);
      });
  });
};

var addStudent = (student) => {
  "use strict";

  return new Promise(
    (resolve, reject) => {
      console.log("hi %j",student);
      Student.findOne({$and:[{'student_id':student.student_id,'classDetails':student.classDetails}]})
      .then(returnStudent => {
        // console.log('returnStudent :: %j',returnStudent);
        if(returnStudent){
          return returnStudent;
        }else{
          var st = new Student(student);
          // console.log('saving');
          return st.save();
        }
      })
      .then(returnStu => {
        // console.log('returnStu :: %j',returnStu)
        resolve(returnStu); })
      .catch(err => {
        if (err.code === undefined) {
          reject({code: '500', reason: err});
        }
        reject(err);
      });
  });
};

var insertJsonFileIntoDB = (jsonData) => {
  return new Promise(
    (resolve, reject) => {
        // Reading bigjson File
        // To Read Big-Json File
        const fs = require('fs');
        const path = require('path');
        const json = require('big-json');

        const readStream = fs.createReadStream(Config.inputFilePath);
        const parseStream = json.createParseStream();
        parseStream.on('data', function(pojo) {
            // => receive reconstructed POJO
            // Accessing the objects in array
            var m = pojo.toString("binary").length;
            for(var i=0;i<m; i++){
              var oid = pojo[i]._id.$oid;
              var stu_id = pojo[i].student_id;
              console.log('oid :: '+oid+', studentID :: '+stu_id);
              if(pojo[i].class_details.length !== 0){
                var n = pojo[i].class_details.length;
                for(var j=0;j<n;j++){

                  var subject = new Subject({
                      uuid: Utils.getUuid(),
                      subject_code: pojo[i].class_details[j].subject_code,
                      subject_desc: pojo[i].class_details[j].subject_desc
                    });
                  addSubject(subject)
                  .then(returnSubject1 => {
                    // console.log('returnSubject1:: %j',returnSubject1);
                    var classdetails = new ClassDetails({
                      uuid : Utils.getUuid(),
                      subject: returnSubject1.uuid,
                      week_start_date: pojo[i].class_details[j].week_start_date,
                      week_end_date: pojo[i].class_details[j].week_end_date,
                      exact_class_date: pojo[i].class_details[j].exact_class_date,
                      day_of_week: pojo[i].class_details[j].day_of_week,
                      room_number: pojo[i].class_details[j].room_number,
                      room: pojo[i].class_details[j].room,
                      gps_coordinates: pojo[i].class_details[j].gps_coordinates,
                      start_time: pojo[i].class_details[j].start_time,
                      end_time: pojo[i].class_details[j].end_time,
                      campus_code: pojo[i].class_details[j].campus_code,
                      hasStandardRoomDescription: pojo[i].class_details[j].hasStandardRoomDescription,
                      duration: pojo[i].class_details[j].duration,
                      duration_code: pojo[i].class_details[j].duration_code,
                      isHoliday: pojo[i].class_details[j].isHoliday
                    });
                     // console.log('classdetails :: %j',classdetails);
                    return addClassDetails(classdetails);
                  })
                  .then(returnClassdetails => {
                    var student = new Student({
                      objectId: oid,
                      student_id: stu_id,
                      classDetails: returnClassdetails.uuid
                    });
                    // console.log('student details :: %j',student);
                    return addStudent(student);
                  })
                  .then(returnS => {

                      resolve(returnS);

                  })
                  .catch(err => {
                          if (err.code === undefined) {
                            reject({code: '500', reason: err});
                          }
                          reject(err);
                        });

                }
              }
            }

        });

        readStream.pipe(parseStream);
        // End of reading big json file

    });
};

// return mongodb connection string
var getDbConnection = (env) => {
  if (!env || env === undefined) { env = app.get('env'); }
  console.log("env: " + env);
  switch(env) {
    case 'development': return Config.mongo.development.connectionString;
    case 'test': return Config.mongo.test.connectionString;
    case 'production': return Config.mongo.production.connectionString;
    default: return null;
  }
};

//jshint unused:false
var setupDB = (dbConnection) => {
  return new Promise((resolve, reject) => {
    var dbConnectionMustBeClosedOnExit = false;
    if (!dbConnection || dbConnection === undefined) {
      var con = getDbConnection(app.get('env'));
      console.log("con : : "+con);
      mongoose.connect(con,{useMongoClient: true});
      dbConnectionMustBeClosedOnExit = true; // DB connection must not be closed if sent by a calling method
    }
    insertJsonFileIntoDB(CoursesData)
    .then(messages => {
      messages.forEach(k => {console.info('\nsaved %j', k);});
      if (dbConnectionMustBeClosedOnExit) { mongoose.disconnect(); }
      resolve(true);
    })
    .catch(err => {
      if (dbConnectionMustBeClosedOnExit) { mongoose.disconnect(); }
      reject(err);
    });
  });
};

if (require.main === module) {
  setupDB()
  .then(result => { console.info('result: ' + result); })
  .catch(err => { console.error('err: ' + err); });
}
else {
  module.exports = {setupDB};
}
