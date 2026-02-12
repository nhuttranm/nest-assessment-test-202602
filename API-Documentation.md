# User Pairs API Documentation

## Overview
This API allows you to create and manage user pairs with UUID identifiers. The main functionality is to check if a pair (id1, id2) already exists in the database, and if not, create a new entry with a generated userID.

## Base URL
`http://localhost:3000`

## Endpoints

### POST /pairs
Creates a new user pair or returns an existing one if the pair already exists.

#### Request
- Method: `POST`
- URL: `/pairs`
- Content-Type: `application/json`

##### Request Body
```json
{
  "id1": "550e8400-e29b-41d4-a716-446655440000",
  "id2": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Parameters:**
- `id1` (string, UUID format): First UUID identifier
- `id2` (string, UUID format): Second UUID identifier

#### Response
- Status: `201 Created`
- Content-Type: `application/json`

```json
{
  "id1": "550e8400-e29b-41d4-a716-446655440000",
  "id2": "550e8400-e29b-41d4-a716-446655440001",
  "userID": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Response Fields:**
- `id1` (string, UUID format): First UUID identifier
- `id2` (string, UUID format): Second UUID identifier
- `userID` (string, UUID format): User ID associated with this pair

**Logic:**
1. The system checks if the pair (id1, id2) exists in the database
2. If the pair exists, it returns the existing userID
3. If the pair doesn't exist, it generates a new UUID for userID, stores the pair in the database, and returns the new userID

### GET /pairs
Retrieves all user pairs from the database.

#### Request
- Method: `GET`
- URL: `/pairs`

#### Response
- Status: `200 OK`
- Content-Type: `application/json`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "id1": "550e8400-e29b-41d4-a716-446655440001",
    "id2": "550e8400-e29b-41d4-a716-446655440002",
    "userID": "550e8400-e29b-41d4-a716-446655440003",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

## Swagger UI
You can interact with the API using the Swagger UI available at: `http://localhost:3000/api`

## Data Model
The system stores user pairs in a `user_pairs` table with the following structure:
- `id`: Primary key (UUID)
- `id1`: First UUID identifier in the pair (UUID)
- `id2`: Second UUID identifier in the pair (UUID)
- `userID`: User ID associated with this pair (UUID)
- `createdAt`: Timestamp when the record was created
- `updatedAt`: Timestamp when the record was last updated

## Caching
The system uses Redis for caching to improve performance. Pairs are cached for 5 minutes after being retrieved from or stored in the database.