var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  objectId: {type: String, required: true},
  student_id: {type: String, required: true},
  classDetails: {type: String, ref: 'ClassDetails'}
});

exports.Student = mongoose.model('Student', studentSchema);
