const mongoose = require('mongoose');


const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true,
    }
    ,
    upload: {
        type: String,
        required: true
    }
})

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;