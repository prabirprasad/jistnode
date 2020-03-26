const mongoose = require('mongoose');
const validator = require('validator');


const feedbackSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    },
    message: {
        type: String,
        trim: true,
        required: true
    }
})

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;