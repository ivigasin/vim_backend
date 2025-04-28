#!/bin/bash

# Set a default BASE_URL if it's not already set in the environment
: ${BASE_URL:="http://localhost:8080"}
# Set default AUTH_HEADER if not set
: ${AUTH_HEADER:="Authorization: Bearer onlyvim2024"}
# Set default CONTENT_TYPE_HEADER if not set
: ${CONTENT_TYPE_HEADER:="Content-Type: application/json"}

# 1. Create User (Valid Request)
curl -X POST "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "test@example.com",
  "telephone": "+1234567890",
  "preferences": {
    "sms": true,
    "email": false
  }
}'

# 2. Create User (Invalid - Missing Email)
curl -X POST "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "telephone": "+0987654321"
}'

# 3. Create User (Invalid - Missing Telephone)
curl -X POST "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "missingtel@example.com"
}'

# 4. Create User (Invalid - Bad Email Format)
curl -X POST "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "not-an-email",
  "telephone": "+111222333"
}'

# 5. Create User (Invalid - Bad Telephone Format - No Plus)
curl -X POST "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "badtel1@example.com",
  "telephone": "1234567890"
}'

# 6. Create User (Invalid - Bad Telephone Format - Too Long)
curl -X POST "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "badtel2@example.com",
  "telephone": "+1234567890123456"
}'

# 7. Create User (Invalid - Bad Telephone Format - Contains Letters)
curl -X POST "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "badtel3@example.com",
  "telephone": "+12345abcde"
}'

# 8. Create User (Valid - Preferences Optional)
curl -X POST "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "test2@example.com",
  "telephone": "+9876543210"
}'

# 9. Edit User (Valid Request - Update Telephone and Prefs)
curl -X PUT "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "test@example.com",
  "telephone": "+1112223334",
  "preferences": {
    "sms": false,
    "email": true
  }
}'

# 10. Edit User (Valid - Only Telephone Update)
curl -X PUT "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "test@example.com",
  "telephone": "+5556667778"
}'

# 11. Edit User (Valid - Only Preferences Update)
curl -X PUT "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "test@example.com",
  "preferences": {
    "sms": true
  }
}'

# 12. Edit User (Invalid - Bad Telephone Format)
curl -X PUT "${BASE_URL}/users/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "test@example.com",
  "telephone": "1112223333"
}'

# 13. Send Notification (Using userId)
curl -X POST "${BASE_URL}/notification/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "userId": "1",
  "message": "Hello user 1, this is a notification!"
}'

# 14. Send Notification (Using email)
curl -X POST "${BASE_URL}/notification/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "email": "test@example.com",
  "message": "Hello test@example.com, this is another notification!"
}'

# 15. Send Notification (Invalid - Missing message)
curl -X POST "${BASE_URL}/notification/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "userId": "1"
}'

# 16. Send Notification (Invalid - Missing user identifier)
curl -X POST "${BASE_URL}/notification/" \
-H "${AUTH_HEADER}" \
-H "${CONTENT_TYPE_HEADER}" \
-d '{
  "message": "A message without a recipient."
}'

# 17. Get All Users
curl -X GET "${BASE_URL}/users/" \
-H "${AUTH_HEADER}"