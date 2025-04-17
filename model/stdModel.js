const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    stdName: {
        type: String
    },
    stdId: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
})

const Student = mongoose.model('student', studentSchema)
module.exports = Student;