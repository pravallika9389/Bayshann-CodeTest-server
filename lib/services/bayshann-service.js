var Subject = require('../models/subject-model').Subject;
var ClassDetails = require('../models/class-details-model').ClassDetails;
var Student = require('../models/student-model').Student;

exports.getUniqueCourses = () => {
  return new Promise(
    (resolve, reject) => {
      Subject.aggregate([
        { $group : { _id : null ,
                    c12: { $addToSet: { Subject_code: "$subject_code",
                    Subject_desc: "$subject_desc" } } }} ])
        .then(dto => {
        resolve(dto); })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var _getSubject = (subjectUuid) =>{
  return new Promise(
    (resolve,reject) => {
      // console.log('subjectUuid %j',subjectUuid);
      Subject.find({'uuid':subjectUuid})
      .then(sub => {
        // console.log('sub :: %j',sub);
        resolve(sub);
      })
      .catch(err => {throw err;});
    })
};

var getListOfStudents = (callback) => {
  return new Promise(
    (resolve, reject) => {
      var classDTO = [];
      ClassDetails.find()
      .then(classArray => {
        for(var i=0;i<classArray.length;i++){

          var classObj = {};
          classObj.uuid =classArray[i].uuid;
          classObj.subject = classArray[i].subject;
          // console.log('classObj %j',classObj);
          classDTO.push(classObj);

        }
        return classDTO;
      })
      .then(classd => {
        // console.log('classd :: %j',classd);
        var classSubjectDTO = [];
        var i = 0;
        var m = classd.length;
        console.log('M '+m);
        classd.forEach(c => {
          // console.log(classd[i].uuid);
          // console.log("i :: "+i)
          var classUuid = c.uuid;
          _getSubject(c.subject)
          .then(sub => {
            // console.log('sub :: %j',sub);
            i++;
            var class_subject = {};
            class_subject.ClassId = classUuid;
            class_subject.subject_code = sub[0].subject_code;
            class_subject.subject_desc = sub[0].subject_desc;
            // console.log('class_subject %j',class_subject)
            classSubjectDTO.push(class_subject);
            if(i == m){
              // console.log("m :: %j",m);
              console.log('classSubjectDTO :: %j',classSubjectDTO);
              resolve(classSubjectDTO);
            }

          })
          .catch(err => {throw err;});

        })
      })
      .catch(err => {
        if (err.code === undefined) { reject({code: '500', reason: err}); }
        reject(err);
      });
  });
};

var _getStudent = (classUuid) =>{
  return new Promise(
    (resolve,reject) => {
      // console.log('classUuid %j',classUuid);
      Student.find({'classDetails':classUuid})
      .then(s => {
        console.log('s :: %j',s);
        resolve(s);
      })
      .catch(err => {throw err;});
    })
};

exports.getListOfStudentsByCourses = (callback) => {
  return new Promise(
    (resolve, reject) => {
      var studentCourseDTO = [];
          getListOfStudents()
          .then(courseSubjectDTO => {
             // console.log('courseSubjectDTO :: %j',courseSubjectDTO);
            var i=0;
            var m = courseSubjectDTO.length;
            courseSubjectDTO.forEach(cs => {
              var classId = cs.ClassId;
              console.log('class :: %j' , cs.ClassId);
              _getStudent(cs.ClassId)
              .then(stu => {
                console.log('stu :: %j',stu);
                i++;
                var stuObj = {};
                stuObj.ClassId = classId;
                stuObj.subject_code = cs.subject_code;
                stuObj.subject_desc = cs.subject_desc;
                stuObj.student_id = stu[0].student_id;
                console.log('stuObj %j',stuObj)
                studentCourseDTO.push(stuObj);
                if(i === m){
                  // console.log("m :: %j",m);
                  // console.log('studentCourseDTO :: %j',studentCourseDTO);
                  // var tasks =  studentCourseDTO;
                  //
                  // var result = tasks.reduce(function(r, e) {
                  //   r[e.student] = (r[e.student] || 0) + +e.subject_desc
                  //   return r;
                  // }, {});
                  //
                  // console.log('result:: %j',result);
                  resolve(studentCourseDTO);
                }
              })
              .catch(err => {throw err;});
            })
          })
          .catch(err => {throw err;});
  });
};
