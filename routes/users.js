// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Course = require('../models/course'); // Ensure you have the Course model
const dotenv = require('dotenv');
dotenv.config();
const middleware = require("../middleware");
const router = express.Router();
const pass = process.env.sceretkey;

// Registration
router.post('/register', async (req, res) => {
    const { username, email, password, mobile } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, email, password, mobile });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, pass, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get user profile
router.get('/myprofile', middleware, async (req, res) => {
    try {
      let userprofile = await User.findById(req.user.id);
      console.log("Fetched user profile:", userprofile);  // Debug: Log the user profile data
      return res.json(userprofile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  // routes/users.js
  router.post('/enroll', middleware, async (req, res) => {
    const { courseTitle } = req.body;
  
    try {
      let user = await User.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ msg: 'User not found' });
      }
  
      // Initialize enrolledCourses if undefined
      if (!user.enrolledCourses) {
        user.enrolledCourses = [];
      }
  
      // Check if the user is already enrolled
      if (user.enrolledCourses.includes(courseTitle)) {
        return res.status(400).json({ msg: 'Already enrolled in this course' });
      }
  
      // Add course to enrolledCourses array
      user.enrolledCourses.push(courseTitle);
      await user.save();
  
      res.json({ msg: 'Course enrolled successfully', enrolledCourses: user.enrolledCourses });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // Get enrolled courses
  router.get('/mycourses', middleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ msg: 'User not found' });
      }
      res.json(user.enrolledCourses || []); // Ensure it returns an empty array if undefined
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

  // Get enrolled courses
router.get('/enrolled-courses', middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.enrolledCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get completed courses
router.get('/completed-courses', middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('completedCourses');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.completedCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

  
  


  

module.exports = router;
