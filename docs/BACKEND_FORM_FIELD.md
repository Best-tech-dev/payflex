# Backend API Form Fields

## Authentication Endpoints

### Sign Up (`/auth/signup`)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Enter Received Otp to verify your email",
  "data": {
    "user": {
      "id": "636d84a6-57f0-4bfb-815f-0726d59e0f7e",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Sign In (`/auth/signin`)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Welcome back",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": null,
    "user": {
      "id": "636d84a6-57f0-4bfb-815f-0726d59e0f7e",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```
