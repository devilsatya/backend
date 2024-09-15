const express = require('express');
const Razorpay = require('razorpay');
const User = require('../models/user');
const Course = require('../models/course');
const middleware = require('../middleware');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order for the payment
router.post('/create-order', middleware, async (req, res) => {
    const { courseId } = req.body; // The course ID should be sent from the frontend

    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).send('Course not found');

        const amount = course.price; // Get the price from the course

        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send('Some error occurred');

        res.json(order);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Capture payment and update user access
router.post('/capture-payment', middleware, async (req, res) => {
    const { paymentId, orderId } = req.body;

    try {
        const payment = await razorpay.payments.fetch(paymentId);

        if (!payment) return res.status(500).send('Payment not found');

        if (payment.status !== 'captured') return res.status(400).send('Payment not successful');

        // Retrieve user and course information
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const course = await Course.findOne({ 'price': payment.amount / 100 });
        if (!course) return res.status(404).send('Course not found');

        if (!user.hasPaid) {
            const allCourses = await Course.find({});
            user.courseAccess = allCourses.map(course => course._id);
            user.hasPaid = true;
            await user.save();
        }

        res.status(200).json({ success: true, msg: 'Payment successful and access to all courses granted' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
