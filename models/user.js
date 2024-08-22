const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  enrolledCourses: [{ type: String }] // Array of course titles
});

module.exports = mongoose.model('User', UserSchema);
