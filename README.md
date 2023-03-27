# sustainability-server
Backend server for clothing sustainability project

INSTALLATION: 

run 'npm install' to install required dependancies

run command 'npm start' to begin server on http://localhost:4000

must provide your own mongodb url on a .env file

to prevent any issues, ensure front end port differs from backend port

Instructions for backendwrappers.js:
    ensure 'axios' is installed before using functions

    copy and paste the file onto front end file structure and use these functions to call the backend client-side

    getLocationReviews(place_id):
        notes: this function calls a GET request for a location referenced by its place_id. 
        If a place_id has no associated database entry, the backend endpoint will create one so that it may be usable in future calls using the same place_id

        the function will return if no place_id is passed

    postLocationReview(place_id, rating, text):
        notes: this function makes a POST request to the backend.
        MUST include place_id or else backend will respond with an error code.
