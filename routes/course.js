const express = require('express');
const router = express.Router();
const Course = require('../models/course'); // Adjust path if necessary

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get a course by title
router.get('/course/:title', async (req, res) => {
    try {
        const course = await Course.findOne({ title: req.params.title });
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).send('Server error');
    }
});


// Export the router
module.exports = router;
