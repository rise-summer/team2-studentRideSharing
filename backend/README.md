# team2- backend

### Abstract
This directory should only include backend project files

### backend Instructions
- Run `npm install` to get dependencies
- Run `npm run server` to start server

### File Structure
- `db.js`
    - Defines MongoDB related operations
- `/routes`
    - `api.js`
        - See [Interface Design](#Interface-Design) below for details.
### Interface Design
- POST /api/rides/:userID/:rideID
    - Add the ride info to database
    - Request Body Example
    ```js
        {
            "pickUpAddr": [0, {"address": "69 Division Ave", "city": "Victorville", "state": "CA", "zip": 92392}],
            //"destAddr": [1, "UCLA"],
            "destAddr": [0, {"city": "Los Angeles", "state": "CA", "zip": 90095}],
            "startDate": new Date(2020, 6, 23, 13, 0),//year, month (0 to 11), date, hours, minutes
            "endDate": new Date(2020, 6, 23, 14, 0),
            "price": 20.0,
            "capacity": 3,
            "car": {"model": "Toyota", "make": "Camry", "color": "White", "plate": "7AVF369"}
        }
    ```
- GET /api/rides?from=xxx&to=xx&time=xxx
    - Return rides that leave from xxx for xx at the specified time
