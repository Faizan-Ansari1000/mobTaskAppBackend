const express = require('express');
const App = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const PORT = process.env.PORT || 5000;

//middleware
App.use(cors());
App.use(express.json());


//connectivity
App.use('/authRoute', authRoute);
App.use('/userRoute', userRoute)

App.use((req, res, next) => {
    next();
});
App.get('/', (req, res) => { res.send('Welcome backend') })


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
})
    .then((res) => {
        App.listen(PORT, () => {
            console.log(`Db Connected and Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
    });

module.exports = App;