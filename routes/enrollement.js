const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const User = require('../models/user'); // Make sure to import User model
const middleware = require("../middleware");

// Enroll in a course
router.post('/enroll/:courseId', middleware, async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if the user is already enrolled
    if (user.enrolledCourses && user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ msg: 'Already enrolled in this course' });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses = [...(user.enrolledCourses || []), courseId];
    await user.save();

    res.json({ msg: 'Enrolled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
