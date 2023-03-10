const express = require("express")
const app = express()
const mongoose = require("mongoose")

const Register = require('./routes/register')
const Reviews = require('./routes/reviews')
const Locations = require('./routes/locations')

const PORT = process.env.PORT || 4000

app.use('/register', Register)
app.use('/reviews', Reviews)
app.use('/locations', Locations)

mongoose.connect("mongodb+srv://admin:3rdrmMd6zEEZKW0u@cluster0.wyntuck.mongodb.net/?retryWrites=true&w=majority")

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))