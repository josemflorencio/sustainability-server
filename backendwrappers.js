/*
    COPY AND PASTE THIS FILE ONTO CLIENT SIDE SCRIPT
*/

import axios from 'axios'

//sends GET request to backend api for a particular location
//returns : reviews array for a given location
//notes : if a marker has no associated database entry, the backend will deal with creating an entry with this endpoint call
function getLocationReviews(place_id) {
    console.log(place_id)
    if(!place_id){
        return null
    }
    const response = await axios.get(`http://127.0.0.1:4000/locations/reviews/${place_id}`)
    return await response.data.reviews
}

//sends POST request to backend api
//notes : please include place_id, rating, and text in function call,
//      not including place_id will result in response error
function postLocationReview(place_id, rating, text){
    if(!place_id){
        return "no place_id"
    }
    axios.post(`http://127.0.0.1:4000/reviews/submit-review`, {
        place_id : place_id,
        rating : rating,
        review : text
    })
    .then((response) => {
        if (response.status == 200){
            return
        }
    })
    .catch((error) => {
        console.log(error)
    })
}

export {getLocationReviews, postLocationReview}