const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const Location = require('../models/Locations')

router.use(bodyParser.json())

/*
    /locations/{id}
    reponse: a location document
*/
router.get('/:id', async (req, res) => {
    const location_id = req.params.id
    const findLocation = await Location.findById(location_id, 'locations').populate('reviews')
    if(!findLocation){
        res.status(204).json({
            message : `NO LOCATION WITH ID: ${location_id} WAS FOUND`
        })
    }
    else{
        res.status(200).json(findLocation)
    }

})

router.post('/location', async (req, res) => {
    const place_id  = req.body.place_id
    const newLocation = new Location({
        place_id
    })
    try {
        const saveLocation = await newLocation.save()
        res.status(201).json({
            message : "LOCATION CREATED"
        })
    } catch (error) {
        res.json({
            message : error
        })
    }
})

module.exports = router