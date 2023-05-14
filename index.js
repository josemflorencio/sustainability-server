const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const morgan = require('morgan')

// ROUTE FILE IMPORTS
const Login = require('./routes/login')
const Reviews = require('./routes/reviews')
const Locations = require('./routes/locations')
const Users = require('./routes/user')

dotenv.config()

const PORT = process.env.PORT

app.use(morgan('tiny'))
app.use(cors())
app.use('/login', Login)
app.use('/reviews', Reviews)
app.use('/locations', Locations)
app.use('/user', Users)

mongoose.connect(process.env.db)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
