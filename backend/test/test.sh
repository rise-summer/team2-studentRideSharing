#!/usr/bin/env bash
curl -H "Content-Type: application/json" \
  --data '{"pickUpAddr": [0, {"address": "69 Division Ave", "city": "Victorville", "state": "CA", "zip": 92392}], "destAddr":"x", "startDate": "new Date(2020, 6, 23, 13, 0)", "endDate": "new Date(2020, 6, 23, 14, 0) ", "price": 20.0, "capacity": 2, "car":  {"model": "Toyota", "make": "Camry", "color": "White", "plate": "7AVF369"}}' \
  http://localhost:3000/api/rides/0/0
  
curl http://localhost:3000/api/rides?from=x&to=x&time=