#!/bin/bash

PORT=3000
BASE_URL="http://localhost:$PORT/api/products"

# Start the server in the background
echo "Starting server..."
node index.js > server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait for server to start
sleep 5

# 1. Search for a product (assuming 'enabled' products exist or we might get empty array, which is still valid JSON)
echo "---------------------------------------------------"
echo "Testing GET /search?q=a..."
curl -s "${BASE_URL}/search?q=a" | python3 -m json.tool

# 2. Get a specific product by ID
# First, let's try to get an ID from the search result if possible, otherwise we might fail if DB is empty.
# I will fetch all first to pick one ID.
echo -e "\n\nFetching all products to pick an ID..."
ALL_PRODUCTS=$(curl -s "${BASE_URL}/")
FIRST_ID=$(echo $ALL_PRODUCTS | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['_id']) if data else print('None')")

if [ "$FIRST_ID" != "None" ]; then
    echo -e "\nTesting GET /:id with ID: $FIRST_ID"
    curl -s "${BASE_URL}/$FIRST_ID" | python3 -m json.tool
else
    echo -e "\nNo products found to test ID route."
fi

# Cleanup
echo -e "\n\nStopping server..."
kill $SERVER_PID
