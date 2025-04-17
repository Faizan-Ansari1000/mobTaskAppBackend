const express = require('express');
const User = require('../model/userModel');

const authRoute = express.Router();
const bcrypt = require('bcrypt');

//signUp post
authRoute.post('/signUp', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ isSuccessfully: false, message: 'Validation error' })
        }
        if (!email.includes('@')) {
            return res.status(400).json({ isSuccessfully: false, message: '@ is must required in email' })
        }
        if (password.length < 6) {
            return res.status(409).json({ isSuccessfully: false, message: 'Password is very short (minimum digits 6)' })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(404).json({ isSuccessfully: false, message: 'Email are already Exist' })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ name, email, password: hashPassword })
        await newUser.save();
        return res.status(201).json({ isSuccessfully: true, message: 'Successfully Account Created', data: newUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ isSuccessfully: false, message: 'INterval server error', error: error.message })
    }
})

// /login post
authRoute.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ isSuccessfully: false, message: 'Validation error' })
        }
        if (!email.includes('@')) {
            return res.status(400).json({ isSuccessfully: false, message: '@ is required in email', error: error.message })
        }
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ isSuccessfully: false, message: 'Email not Found', })
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password)
        if (!matchPassword) {
            return res.status(409).json({ isSuccessfully: false, message: 'Invalid Password', })
        }
        return res.status(201).json({ isSuccessfully: true, message: 'Successfully LoggedIn', data: existingUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ isSuccessfully: false, message: 'Server error', error: error.message })
    }
})

//user get
authRoute.get('/signUp/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const getUser = await User.findById(id)
        if (!getUser) {
            return res.status(400).json({ isSuccessfully: false, message: 'No Profile Found' })
        } else {
            return res.status(200).json({ isSuccessfully: true, message: 'Successfully Profile Found', data: getUser })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ isSuccessfully: false, message: 'Server error', error: error.message })
    }
})

//forgot password post
authRoute.post('/forgotPassword', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        if (!email || !newPassword) {
            return res.status(400).json({ isSuccessfully: false, message: 'Validation error' })
        }
        if (!email.includes('@')) {
            return res.status(409).json({ isSuccessfully: false, message: '@ is required in email' })
        }
        if (newPassword.length < 7) {
            return res.status(412).json({ isSuccessfully: false, message: 'Minimum length of Password id +6' })
        }
        const checkUser = await User.findOne({ email })
        if (!checkUser) {
            res.status(404).json({ isSuccessfully: false, message: 'Email not Found' })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        checkUser.password = hashedPassword;
        await checkUser.save();
        return res.status(201).json({ isSuccessfully: true, message: 'Password updated successfully', data: checkUser });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ isSuccessfully: false, message: 'Server error', error: error.message })
    }
})

module.exports = authRoute;