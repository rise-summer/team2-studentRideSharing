# team2- backend

## Abstract
This directory should only include backend project files

## backend Instructions
- Run `npm install` to get dependencies
- Run `npm run server` to start server

## File Structure
- `db.js`
    - Defines MongoDB related operations
- `/routes`
    - [rides.js](#rides) Defines all rides-related operations
      - [Search for rides](#search-for-rides)
      - [Add a new ride](#add-a-new-ride)
      - [Get a specific ride](#get-a-specific-ride)
    - [users.js](#users) Defines all users-related operations
      - [Register a new user](#register-a-new-user)
    - [vehicles.js](#vehicles) Defines all vehicles-related operations
      - [Register a new car for the user](#register-a-new-car-for-the-user)
      - [Get all cars of a user](#get-all-cars-of-a-user)
- `/test`
    - `dbTest.js`
        - Initialize Database with test data and test sample query

## Interface Design
### Rides
#### Search for rides
- `GET /api/rides?query=`
- use querystring Library to generate the query string in url
    - check out [dbTest.js](./test/dbTest.js) for usage
    - current query template
        ```js
          var query = {
                        originCoords: [-119.159392, 34.164958,],
                        destCoords: [-117.221505, 32.873788, ],
                        beginDate: new Date(2020, 6, 23, 13, 0),
                        endDate: new Date(2020, 6, 23, 14, 0),
                        distance: 0.5//miles
                      };
        ```
        - Return all rides that leave from a place within 0.5 mile from originCoords to a place within 0.5 mile from destCoords within the specified time range
        - TODO: add pagination
#### Add a new ride
- `POST /api/rides/:userID`
- Request Body Example
    ```js
    {
        "origin": {
            "address": "69 Division Ave",
            "city": "Victorville",
            "state": "CA",
            "zip": 92392,
            "display": "69 Division Ave, Victorville CA, 92392"
        },
        "destination": {
            "city": "Los Angeles",
            "state": "CA",
            "zip": 90095,
            "display": "UCLA"
        },
        "originCoords": {
                            "type": "Point",
                            "coordinates": [-119.158323, 34.177169]//<longitude>, <latitude>              
                        },                
        "destCoords": {
                            "type": "Point",
                            "coordinates": [-117.274471, 32.832215]//<longitude>, <latitude>              
                        },
        "time": new Date(2020, 6, 23, 13, 0),//year, month (0 to 11), date, hours, minutes          
        "price": 20.0,
        "capacity": 3,
        "car": {"make": "Toyota", "model": "Camry", "color": "White", "plate": "7AVF369"}
    }
    ```
- Response
    - `201` Created
        - location: /api/rides/:userID/:rideID
    - `400` Error
#### Get a specific ride
- `GET /api/rides/:userID/:rideID`
- Response
    - `200` If the ride exist
    - `404` Not Found
### Users
#### Register a new user
- `POST /api/users/signup`
- Request Body Example
    ```js
    {
        "email": "joeBruin@g.ucla.edu",
        "password": "$2y$12$OHg187rZ3o03lz35w7OLpOBLnclvzZ2reJo.KEbRzbwt5YIVvd9Gm",
        "firstName": "Joe",
        "lastName": "Bruin",
        "contact": {"phone": "3239382311"}
    }
    ```
- Response
    - `201` Created
    - `409` Email Already Exists
### Vehicles
#### Register a new car for the user
- `POST /api/vehicles/:userID`
- Request Body Example
    ```js
    {
        "make": "Ford",
        "model": "Focus",
        "color": "Grey",
        "plate": "7AZM870",
        "capacity": 4
    }
    ```
- Response
    - `201` Created
    - `400` Error
- TODO: restrict 2 car records per user?
#### Get all cars of a user
- `GET /api/vehicles/:userID`
- Response
    - `200`
    - `400` Error
