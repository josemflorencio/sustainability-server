const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const Register = require('./routes/register')
const Reviews = require('./routes/reviews')
const Locations = require('./routes/locations')

dotenv.config()

const PORT = process.env.PORT

app.use('/register', Register)
app.use('/reviews', Reviews)
app.use('/locations', Locations)

mongoose.connect(process.env.db)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))