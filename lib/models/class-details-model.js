var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classDetailsSchema = new Schema({
  uuid: {type: String, required: true},
  subject: {type: String, ref: 'Subject'},
  week_start_date: {type: Date, required: true},
  week_end_date: {type: Date, required: true},
  exact_class_date: {type: Date, required: true},
  day_of_week: {type: String, required: true},
  room_number: {type: String, required: true},
  room: {type: String, required: true},
  gps_coordinates: {type: String, required: true},
  start_time: {type: String, required: true},
  end_time: {type: String, required: true},
  campus_code: {type: String, required: true},
  hasStandardRoomDescription: {type: String, required: true},
  duration: {type: String, required: true},
  duration_code: {type: String, required: true},
  isHoliday: {type: String, required: true},
});

exports.ClassDetails = mongoose.model('ClassDetails', classDetailsSchema);
