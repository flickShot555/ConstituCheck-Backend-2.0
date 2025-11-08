#!/bin/bash
echo "Starting Python microservice..."
python3 python/app.py &

echo "Starting Node.js backend..."
npm start