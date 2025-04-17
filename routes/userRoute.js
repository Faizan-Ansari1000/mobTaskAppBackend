const express = require('express');
const Student = require('../model/stdModel');

const userRoute = express.Router();

// student post
userRoute.post('/studentData', async (req, res) => {
    const { stdName, stdId, city, country } = req.body;
    if (!stdName || !stdId || !city || !country) {
        return res.status(400).json({ isSuccessfully: false, message: 'Validation error' })
    }
    try {
        const savedStudent = await Student.create({ stdName, stdId, city, country })
        await savedStudent.save();
        return res.status(201).json({ isSuccessfully: true, message: 'Successfully Post Data', data: savedStudent })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ isSuccessfully: false, message: 'Server error', error: error.message })
    }
})

//std get
userRoute.get('/studentData', async (req, res) => {
    try {
        const getStudents = await Student.find()
        if (getStudents.length == 0) {
            return res.status(400).json({ isSuccessfully: false, message: 'No Data Found' })
        } else {
            return res.status(200).json({ isSuccessfully: true, message: 'Successfully All Data Get', data: getStudents })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ isSuccessfully: false, message: 'Server error', error: error.message })
    }
})

//std delete
userRoute.delete('/studentData/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deleteStudent = await Student.findByIdAndDelete(id);
        if (deleteStudent.length == 0) {
            return res.status(400).json({ isSuccessfully: false, message: 'No Data Delete' })
        } else {
            return res.status(200).json({ isSuccessfully: true, message: 'Successfully Data Deleted' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ isSuccessfully: false, message: 'Server error', error: error.message })
    }
})

module.exports = userRoute;