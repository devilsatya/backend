// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const dotenv=require('dotenv');
dotenv.config();
const middleware=require("../middleware.js") 
const router = express.Router();
const pass=process.env.sceretkey
// Registration
router.post('/register', async (req, res) => {
    const { username, email, password ,mobile} = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({  username, email, password ,mobile });

        // Hash password
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
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT
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
router.get('/myprofile',middleware,async(req,res)=>{
    try{
        let userprofile=await User.findById(req.user.id);
        return res.json(userprofile);
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;
