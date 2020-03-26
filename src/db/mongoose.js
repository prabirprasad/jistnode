const mongoose = require('mongoose')

// Connecting to Mongodb
mongoose.connect('mongodb://127.0.0.1:27017/jist', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
