const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    longdescription: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: String, default: '' },
    classes: { type: String, default: '' },
    instructor: { type: String, default: '' },
    prerequisites: { type: String, default: '' },
    price: { type: Number, required: true }, // Add price field
    lin: { type: String, default: '' },
    lin1: { type: String, default: '' },
    lin2: { type: String, default: '' },
    lin3: { type: String, default: '' },
    lin4: { type: String, default: '' },
    lin5: { type: String, default: '' },
    lin6: { type: String, default: '' },
    lin7: { type: String, default: '' },
    lin8: { type: String, default: '' },
    lin9: { type: String, default: '' },
    lin10: { type: String, default: '' },
    lin11: { type: String, default: '' },
    lin12: { type: String, default: '' },
    session1: { type: String, default: '' },
    session2: { type: String, default: '' },
    session3: { type: String, default: '' },
    session4: { type: String, default: '' },
    session5: { type: String, default: '' },
    session6: { type: String, default: '' },
    session7: { type: String, default: '' },
    session8: { type: String, default: '' },
    session9: { type: String, default: '' },
    session10: { type: String, default: '' },
    session11: { type: String, default: '' },
    session12: { type: String, default: '' }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
