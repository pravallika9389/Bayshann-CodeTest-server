var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subjectSchema = new Schema({
  uuid: {type: String, required: true},
  subject_code: {type: String, required: true },
  subject_desc: {type: String, required: true }
});

exports.Subject = mongoose.model('Subject', subjectSchema);
