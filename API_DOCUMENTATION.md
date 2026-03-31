# Recruitment Server - API Documentation

## Overview
This document provides comprehensive API documentation for the Recruitment Server client-side API calls. All endpoints require authentication unless otherwise specified.

**Base URL:** `http://localhost:PORT/api`

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User APIs](#user-apis)
3. [Job Role APIs](#job-role-apis)
4. [Job Application APIs](#job-application-apis)
5. [Test APIs](#test-apis)
6. [Interview APIs](#interview-apis)
7. [Skill APIs](#skill-apis)

---

# Authentication APIs

## 1. User Registration

### API Name
Register New User

### Endpoint URL
`/auth/register`

### HTTP Method
`POST`

### Description
Creates a new user account in the system. The user must provide valid credentials and complete profile information. Upon successful registration, authentication tokens are issued.

### Request Headers
```
Content-Type: application/json
```

### Request Payload
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "9876543210",
  "roleId": "optional_role_objectId"
}
```

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| email | string (email) | Yes | User's email address (must be unique and valid) |
| password | string | Yes | User's password (minimum 4 characters) |
| firstName | string | Yes | User's first name |
| lastName | string | Yes | User's last name |
| phoneNumber | string | Yes | User's phone number (minimum 10 digits) |
| roleId | string (ObjectId) | No | MongoDB ObjectId for user role |

### Sample Request
```javascript
const registerUser = async () => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'john.doe@example.com',
      password: 'secretPass123',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '9876543210'
    }),
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "9876543210",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if registration was successful |
| data | object | User data object |
| data.id | string (ObjectId) | Unique user identifier |
| data.email | string | User's email address |
| data.firstName | string | User's first name |
| data.lastName | string | User's last name |
| data.phoneNumber | string | User's phone number |
| data.role | string | User's role in the system |
| data.token | string | JWT access token (expires in 1 hour) |
| data.refreshToken | string | JWT refresh token (expires in 7 days) |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "Email is required" | Email field is missing |
| 400 | "A valid email address is required" | Email format is invalid |
| 400 | "Password must be at least 4 characters long" | Password is too short |
| 400 | "First name is required" | First name field is missing |
| 400 | "Last name is required" | Last name field is missing |
| 400 | "Phone number must be at least 10 digits long" | Phone number is invalid |
| 409 | "Email already exists" | Email is already registered |
| 500 | "Internal server error" | Server error during registration |

---

## 2. User Login

### API Name
Authenticate User

### Endpoint URL
`/auth/login`

### HTTP Method
`POST`

### Description
Authenticates a user with email and password credentials. Returns access and refresh tokens for subsequent API calls.

### Request Headers
```
Content-Type: application/json
```

### Request Payload
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| email | string (email) | Yes | User's registered email address |
| password | string | Yes | User's password |

### Sample Request
```javascript
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    }),
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "expiresIn": 3600,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "9876543210",
    "role": "candidate",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if login was successful |
| expiresIn | number | Access token expiration time in seconds |
| data | object | User data and token object |
| data.id | string (ObjectId) | Unique user identifier |
| data.email | string | User's email address |
| data.firstName | string | User's first name |
| data.lastName | string | User's last name |
| data.phoneNumber | string | User's phone number |
| data.role | string | User's role (e.g., "candidate", "admin", "recruiter") |
| data.token | string | JWT access token (1 hour expiry) |
| data.refreshToken | string | JWT refresh token (7 days expiry) |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "A valid email address is required" | Email format is invalid |
| 400 | "Email is required" | Email field is missing |
| 400 | "Password is required" | Password field is missing |
| 401 | "Invalid email or password" | Email not found or password incorrect |
| 500 | "Internal server error" | Server error during authentication |

---

## 3. Refresh Token

### API Name
Refresh Access Token

### Endpoint URL
`/auth/refresh`

### HTTP Method
`POST`

### Description
Generates a new access token using a valid refresh token. Used when the current access token has expired.

### Request Headers
```
Content-Type: application/json
Cookie: refreshToken=<token_value>
```

### Request Payload
```json
{}
```

### Request Parameters
No request body parameters required. The refresh token is sent via HTTP cookie.

### Sample Request
```javascript
const refreshAccessToken = async () => {
  const response = await fetch('http://localhost:5000/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if token refresh was successful |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 401 | "Unauthorized" | Refresh token is missing or invalid |
| 500 | "Internal server error" | Server error during token refresh |

---

# User APIs

## 4. Get Current User Profile

### API Name
Fetch Authenticated User Profile

### Endpoint URL
`/users/me`

### HTTP Method
`GET`

### Description
Retrieves the profile information of the currently authenticated user. Requires valid JWT token.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
No request body required.

### Request Parameters
No query parameters required.

### Sample Request
```javascript
const getUserProfile = async (accessToken) => {
  const response = await fetch('http://localhost:5000/api/users/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "9876543210",
    "role": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "candidate",
      "description": "Candidate user role"
    }
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if request was successful |
| data | object | User profile data |
| data.id | string (ObjectId) | Unique user identifier |
| data.email | string | User's email address |
| data.firstName | string | User's first name |
| data.lastName | string | User's last name |
| data.phoneNumber | string | User's phone number |
| data.role | object | User's role information |
| data.role._id | string (ObjectId) | Role identifier |
| data.role.name | string | Role name |
| data.role.description | string | Role description |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 404 | "User not found" | User account does not exist |
| 500 | "Internal server error" | Server error during profile retrieval |

---

## 5. Update User Profile

### API Name
Update Authenticated User Profile

### Endpoint URL
`/users/me`

### HTTP Method
`PATCH`

### Description
Updates the profile information of the currently authenticated user. Supports updating firstName, lastName, and phoneNumber.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "9876543211"
}
```

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| firstName | string | No | User's first name |
| lastName | string | No | User's last name |
| phoneNumber | string | No | User's phone number |

### Sample Request
```javascript
const updateUserProfile = async (accessToken, updates) => {
  const response = await fetch('http://localhost:5000/api/users/me', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '9876543211'
    }),
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "9876543211",
    "role": "candidate"
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if update was successful |
| data | object | Updated user profile data |
| data.id | string (ObjectId) | Unique user identifier |
| data.email | string | User's email address |
| data.firstName | string | Updated first name |
| data.lastName | string | Updated last name |
| data.phoneNumber | string | Updated phone number |
| data.role | object/string | User's role information |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "Validation error message" | Request data validation failed |
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 404 | "User not found" | User account does not exist |
| 500 | "Internal server error" | Server error during profile update |

---

## 6. Get All Users (Admin Only)

### API Name
Retrieve All Users

### Endpoint URL
`/users/allUser`

### HTTP Method
`GET`

### Description
Retrieves a paginated list of all users in the system. Admin-only endpoint. Supports search filtering.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
No request body required.

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| page | number | No | Page number (default: 1) |
| limit | number | No | Records per page (default: 10) |
| search | string | No | Search term to filter users by name |

### Sample Request
```javascript
const getAllUsers = async (accessToken, page = 1, limit = 10, search = '') => {
  const queryParams = new URLSearchParams({
    page: page,
    limit: limit,
    search: search
  });
  
  const response = await fetch(
    `http://localhost:5000/api/users/allUser?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
  );
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "9876543210",
      "role": "candidate",
      "isVerified": true
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "email": "jane.smith@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "phoneNumber": "9876543211",
      "role": "recruiter",
      "isVerified": false
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if request was successful |
| data | array | Array of user objects |
| data[].id | string (ObjectId) | Unique user identifier |
| data[].email | string | User's email address |
| data[].firstName | string | User's first name |
| data[].lastName | string | User's last name |
| data[].phoneNumber | string | User's phone number |
| data[].role | string | User's role |
| data[].isVerified | boolean | Email verification status |
| pagination | object | Pagination information |
| pagination.total | number | Total number of users |
| pagination.page | number | Current page number |
| pagination.limit | number | Records per page |
| pagination.pages | number | Total number of pages |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 403 | "Forbidden" | User does not have admin role |
| 500 | "Internal server error" | Server error during user retrieval |

---

# Job Role APIs

## 7. Create Job Role (Admin Only)

### API Name
Create New Job Role

### Endpoint URL
`/jobs`

### HTTP Method
`POST`

### Description
Creates a new job role/opening in the system. Admin-only endpoint. Requires comprehensive job details including location, salary, and required skills.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
```json
{
  "title": "Senior Frontend Developer",
  "requiredExperience": "3-5 years",
  "category": "507f1f77bcf86cd799439013",
  "education": "Bachelor's in Computer Science",
  "description": "We are looking for an experienced frontend developer...",
  "skills": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"],
  "jobType": "Remote",
  "salary": {
    "min": 50000,
    "max": 80000,
    "currency": "USD"
  },
  "location": {
    "city": "San Francisco",
    "state": "California",
    "country": "United States",
    "pincode": "94105"
  },
  "expiry": "2026-12-31T23:59:59Z",
  "clientId": "507f1f77bcf86cd799439016"
}
```

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| title | string | Yes | Job position title (3-100 characters) |
| requiredExperience | string | Yes | Required experience (1-50 characters) |
| category | string (ObjectId) | Yes | MongoDB ObjectId of job category |
| education | string | Yes | Required education level (3-100 characters) |
| description | string | Yes | Detailed job description (10-2000 characters) |
| skills | array | Yes | Array of skill ObjectIds required for position |
| jobType | string | Yes | Type of job (Remote, Hybrid, Full-Time, Part-Time) |
| salary | object | Yes | Salary information object |
| salary.min | number | Yes | Minimum salary (≥ 0) |
| salary.max | number | Yes | Maximum salary (≥ 0) |
| salary.currency | string | Yes | Currency code (INR, USD, EUR, GBP) |
| location | object | Yes | Job location details |
| location.city | string | Yes | City name (2-100 characters) |
| location.state | string | Yes | State name (2-100 characters) |
| location.country | string | Yes | Country name (2-100 characters) |
| location.pincode | string | Yes | Pincode/ZIP (4-10 numeric characters) |
| expiry | string (ISO 8601) | Yes | Job posting expiry date |
| clientId | string (ObjectId) | Yes | ObjectId of client/hiring manager |

### Sample Request
```javascript
const createJobRole = async (accessToken, jobData) => {
  const response = await fetch('http://localhost:5000/api/jobs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Frontend Developer',
      requiredExperience: '3-5 years',
      category: '507f1f77bcf86cd799439013',
      education: 'Bachelor in CS',
      description: 'Develop web applications using React and TypeScript...',
      skills: ['507f1f77bcf86cd799439014'],
      jobType: 'Remote',
      salary: {
        min: 50000,
        max: 80000,
        currency: 'USD'
      },
      location: {
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        pincode: '94105'
      },
      expiry: '2026-12-31T23:59:59Z',
      clientId: '507f1f77bcf86cd799439016'
    }),
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "message": "Job role created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439017",
    "title": "Senior Frontend Developer",
    "requiredExperience": "3-5 years",
    "category": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Technology"
    },
    "education": "Bachelor's in Computer Science",
    "description": "We are looking for an experienced frontend developer...",
    "skills": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "name": "React"
      }
    ],
    "jobType": "Remote",
    "salary": {
      "min": 50000,
      "max": 80000,
      "currency": "USD"
    },
    "location": {
      "city": "San Francisco",
      "state": "California",
      "country": "United States",
      "pincode": "94105"
    },
    "expiry": "2026-12-31T23:59:59Z",
    "clientId": "507f1f77bcf86cd799439016",
    "createdAt": "2026-03-05T10:30:00Z"
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if job creation was successful |
| message | string | Success message |
| data | object | Created job role data |
| data.id | string (ObjectId) | Unique job role identifier |
| data.title | string | Job position title |
| data.requiredExperience | string | Required experience |
| data.category | object | Category information |
| data.education | string | Required education level |
| data.description | string | Job description |
| data.skills | array | Array of required skills |
| data.jobType | string | Type of employment |
| data.salary | object | Salary details |
| data.location | object | Location details |
| data.expiry | string | Job posting expiry date |
| data.clientId | string (ObjectId) | Client/hiring manager ID |
| data.createdAt | string (ISO 8601) | Job creation timestamp |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "Title must be at least 3 characters long" | Title is too short |
| 400 | "Category must be a valid ObjectId" | Invalid category ObjectId |
| 400 | "Description must be at least 10 characters long" | Description is too short |
| 400 | "Salary min must be 0 or greater" | Invalid salary range |
| 400 | "Currency must be INR, USD, EUR, or GBP" | Invalid currency |
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 403 | "Forbidden" | User does not have admin role |
| 500 | "Internal server error" | Server error during job creation |

---

## 8. Get All Job Roles

### API Name
Retrieve Job Roles

### Endpoint URL
`/jobs`

### HTTP Method
`GET`

### Description
Retrieves a paginated list of job roles from the system. Supports filtering and searching by various criteria.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
No request body required.

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| page | number | No | Page number (default: 1) |
| limit | number | No | Records per page (default: 10) |
| search | string | No | Search term for job title or description |
| category | string (ObjectId) | No | Filter by job category |
| jobType | string | No | Filter by job type (Remote, Hybrid, Full-Time, Part-Time) |

### Sample Request
```javascript
const getJobRoles = async (accessToken, page = 1, limit = 10, filters = {}) => {
  const queryParams = new URLSearchParams({
    page: page,
    limit: limit,
    ...filters
  });
  
  const response = await fetch(
    `http://localhost:5000/api/jobs?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
  );
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439017",
      "title": "Senior Frontend Developer",
      "requiredExperience": "3-5 years",
      "category": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Technology"
      },
      "education": "Bachelor's in Computer Science",
      "description": "We are looking for an experienced frontend developer...",
      "jobType": "Remote",
      "salary": {
        "min": 50000,
        "max": 80000,
        "currency": "USD"
      },
      "location": {
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "pincode": "94105"
      },
      "expiry": "2026-12-31T23:59:59Z",
      "createdAt": "2026-03-05T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if request was successful |
| data | array | Array of job role objects |
| data[].id | string (ObjectId) | Unique job role identifier |
| data[].title | string | Job position title |
| data[].requiredExperience | string | Required experience |
| data[].category | object | Category information |
| data[].education | string | Required education level |
| data[].description | string | Job description |
| data[].jobType | string | Type of employment |
| data[].salary | object | Salary details |
| data[].location | object | Location details |
| data[].expiry | string (ISO 8601) | Job posting expiry date |
| data[].createdAt | string (ISO 8601) | Creation timestamp |
| pagination | object | Pagination information |
| pagination.total | number | Total number of job roles |
| pagination.page | number | Current page number |
| pagination.limit | number | Records per page |
| pagination.pages | number | Total number of pages |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "Invalid query parameters" | Query parameters validation failed |
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 500 | "Internal server error" | Server error during jobs retrieval |

---

# Job Application APIs

## 9. Apply for Job

### API Name
Submit Job Application

### Endpoint URL
`/job-apply`

### HTTP Method
`POST`

### Description
Allows a candidate to submit an application for a specific job role. Requires job ID, resume URL, and optional application message and answers to screening questions.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
```json
{
  "jobId": "507f1f77bcf86cd799439017",
  "resumeUrl": "https://s3.amazonaws.com/resumes/john-doe-resume.pdf",
  "message": "I am very interested in this position...",
  "answers": [
    {
      "question": "Why do you want to join our company?",
      "answer": "I am passionate about...",
      "questionId": "507f1f77bcf86cd799439080"
    }
  ]
}
```

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| jobId | string (ObjectId) | Yes | MongoDB ObjectId of job role |
| resumeUrl | string (URL) | Yes | URL to candidate's resume file |
| message | string | No | Application cover message |
| answers | array | No | Array of answers to job application questions |
| answers[].questionId | string (ObjectId) | No | Question identifier |
| answers[].question | string | No | Question text |
| answers[].answer | string | No | Candidate's answer to question |

### Sample Request
```javascript
const applyForJob = async (accessToken, applicationData) => {
  const response = await fetch('http://localhost:5000/api/job-apply', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jobId: '507f1f77bcf86cd799439017',
      resumeUrl: 'https://s3.amazonaws.com/resumes/resume.pdf',
      message: 'I am interested in this position.',
      answers: [
        {
          questionId: '507f1f77bcf86cd799439080',
          question: 'Why join us?',
          answer: 'I love your company culture.'
        }
      ]
    }),
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439040",
    "jobId": "507f1f77bcf86cd799439017",
    "candidateId": "507f1f77bcf86cd799439011",
    "resumeUrl": "https://s3.amazonaws.com/resumes/john-doe-resume.pdf",
    "message": "I am very interested in this position...",
    "status": "pending",
    "appliedAt": "2026-03-05T10:35:00Z"
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if application was successful |
| message | string | Success message |
| data | object | Application data |
| data.id | string (ObjectId) | Unique application identifier |
| data.jobId | string (ObjectId) | Applied job role ID |
| data.candidateId | string (ObjectId) | Candidate user ID |
| data.resumeUrl | string (URL) | URL to uploaded resume |
| data.message | string | Application message |
| data.status | string | Application status (pending, accepted, rejected) |
| data.appliedAt | string (ISO 8601) | Application submission timestamp |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "Resume URL is required" | Resume URL not provided |
| 400 | "Job ID is required" | Job ID not provided |
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 404 | "Job role not found" | Job ID does not exist |
| 409 | "You have already applied for this job" | Duplicate application for same job |
| 500 | "Internal server error" | Server error during application submission |

---

## 10. Get All Job Applications (Admin Only)

### API Name
Retrieve All Job Applications

### Endpoint URL
`/job-apply`

### HTTP Method
`GET`

### Description
Retrieves a paginated list of all job applications submitted by candidates. Admin-only endpoint.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
No request body required.

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| page | number | No | Page number (default: 1) |
| limit | number | No | Records per page (default: 10) |

### Sample Request
```javascript
const getAllApplications = async (accessToken, page = 1, limit = 10) => {
  const queryParams = new URLSearchParams({
    page: page,
    limit: limit
  });
  
  const response = await fetch(
    `http://localhost:5000/api/job-apply?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
  );
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439040",
      "jobId": "507f1f77bcf86cd799439017",
      "candidateId": "507f1f77bcf86cd799439011",
      "candidateName": "John Doe",
      "candidateEmail": "john.doe@example.com",
      "resumeUrl": "https://s3.amazonaws.com/resumes/john-doe-resume.pdf",
      "message": "I am very interested in this position...",
      "status": "pending",
      "appliedAt": "2026-03-05T10:35:00Z"
    }
  ],
  "pagination": {
    "total": 125,
    "page": 1,
    "limit": 10,
    "pages": 13
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if request was successful |
| data | array | Array of application objects |
| data[].id | string (ObjectId) | Unique application identifier |
| data[].jobId | string (ObjectId) | Job role ID |
| data[].candidateId | string (ObjectId) | Candidate user ID |
| data[].candidateName | string | Candidate's full name |
| data[].candidateEmail | string | Candidate's email address |
| data[].resumeUrl | string (URL) | URL to candidate's resume |
| data[].message | string | Application message |
| data[].status | string | Application status |
| data[].appliedAt | string (ISO 8601) | Application submission timestamp |
| pagination | object | Pagination information |
| pagination.total | number | Total number of applications |
| pagination.page | number | Current page number |
| pagination.limit | number | Records per page |
| pagination.pages | number | Total number of pages |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 403 | "Forbidden" | User does not have admin role |
| 500 | "Internal server error" | Server error during applications retrieval |

---

## 11. Update Application Status (Admin Only)

### API Name
Update Job Application Status

### Endpoint URL
`/job-apply/:status`

### HTTP Method
`PATCH`

### Description
Updates the status of a job application. Admin-only endpoint. Statuses include pending, accepted, rejected, and others.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
```json
{
  "applicationId": "507f1f77bcf86cd799439040",
  "status": "accepted"
}
```

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| applicationId | string (ObjectId) | Yes | MongoDB ObjectId of application to update |
| status | string | Yes | New application status (pending, accepted, rejected) |

### Sample Request
```javascript
const updateApplicationStatus = async (accessToken, applicationId, newStatus) => {
  const response = await fetch(
    `http://localhost:5000/api/job-apply/${newStatus}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicationId: applicationId,
        status: newStatus
      }),
      credentials: 'include'
    }
  );
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "message": "Application status updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439040",
    "jobId": "507f1f77bcf86cd799439017",
    "candidateId": "507f1f77bcf86cd799439011",
    "status": "accepted",
    "updatedAt": "2026-03-05T11:00:00Z"
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if update was successful |
| message | string | Success message |
| data | object | Updated application data |
| data.id | string (ObjectId) | Application identifier |
| data.jobId | string (ObjectId) | Job role ID |
| data.candidateId | string (ObjectId) | Candidate user ID |
| data.status | string | Updated application status |
| data.updatedAt | string (ISO 8601) | Status update timestamp |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "Status is required" | Status field not provided |
| 400 | "Application ID is required" | Application ID not provided |
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 403 | "Forbidden" | User does not have admin role |
| 404 | "Application not found" | Application ID does not exist |
| 500 | "Internal server error" | Server error during status update |

---

# Test APIs

## 12. Create Test

### API Name
Create Assessment Test

### Endpoint URL
`/tests`

### HTTP Method
`POST`

### Description
Creates a new assessment test for candidates. Requires test details including title, duration, passing score, and questions.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
```json
{
  "title": "JavaScript Fundamentals Assessment",
  "description": "Test your JavaScript skills",
  "duration": 60,
  "passingScore": 70,
  "totalQuestions": 25,
  "instructions": "Answer all questions within the time limit",
  "publishedStatus": true,
  "questions": [
    {
      "questionText": "What is a closure in JavaScript?",
      "questionType": "multiple-choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}
```

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| title | string | Yes | Test title |
| description | string | No | Test description |
| duration | number | Yes | Test duration in minutes |
| passingScore | number | Yes | Minimum score to pass (0-100) |
| totalQuestions | number | Yes | Total number of questions |
| instructions | string | No | Test instructions for candidates |
| publishedStatus | boolean | No | Whether test is published (default: false) |
| questions | array | No | Array of test questions |
| questions[].questionText | string | Yes | Question content |
| questions[].questionType | string | Yes | Type of question (multiple-choice, essay, etc) |
| questions[].options | array | No | Answer options for multiple-choice |
| questions[].correctAnswer | string/number | No | Correct answer for the question |

### Sample Request
```javascript
const createTest = async (accessToken, testData) => {
  const response = await fetch('http://localhost:5000/api/tests', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Frontend Developer Assessment',
      description: 'Test your frontend skills',
      duration: 90,
      passingScore: 75,
      totalQuestions: 30,
      publishedStatus: true
    }),
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "title": "JavaScript Fundamentals Assessment",
    "description": "Test your JavaScript skills",
    "duration": 60,
    "passingScore": 70,
    "totalQuestions": 25,
    "instructions": "Answer all questions within the time limit",
    "publishedStatus": true,
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2026-03-05T10:40:00Z"
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if test creation was successful |
| data | object | Created test data |
| data.id | string (ObjectId) | Unique test identifier |
| data.title | string | Test title |
| data.description | string | Test description |
| data.duration | number | Test duration in minutes |
| data.passingScore | number | Passing score threshold |
| data.totalQuestions | number | Total number of questions |
| data.instructions | string | Test instructions |
| data.publishedStatus | boolean | Publication status |
| data.createdBy | string (ObjectId) | Creator user ID |
| data.createdAt | string (ISO 8601) | Test creation timestamp |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "Title is required" | Test title not provided |
| 400 | "Duration must be a positive number" | Invalid duration value |
| 400 | "Passing score must be between 0 and 100" | Invalid passing score |
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 500 | "Internal server error" | Server error during test creation |

---

## 13. Get Published Tests

### API Name
Retrieve Published Tests

### Endpoint URL
`/tests/published/all`

### HTTP Method
`GET`

### Description
Retrieves all published tests available for candidates to take. Does not require authentication.

### Request Headers
```
Content-Type: application/json
```

### Request Payload
No request body required.

### Request Parameters
No query parameters required.

### Sample Request
```javascript
const getPublishedTests = async () => {
  const response = await fetch(
    'http://localhost:5000/api/tests/published/all',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439050",
      "title": "JavaScript Fundamentals Assessment",
      "description": "Test your JavaScript skills",
      "duration": 60,
      "passingScore": 70,
      "totalQuestions": 25,
      "createdAt": "2026-03-05T10:40:00Z"
    },
    {
      "id": "507f1f77bcf86cd799439051",
      "title": "React Expert Assessment",
      "description": "Advanced React assessment",
      "duration": 90,
      "passingScore": 80,
      "totalQuestions": 40,
      "createdAt": "2026-03-05T10:45:00Z"
    }
  ]
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if request was successful |
| data | array | Array of published test objects |
| data[].id | string (ObjectId) | Unique test identifier |
| data[].title | string | Test title |
| data[].description | string | Test description |
| data[].duration | number | Test duration in minutes |
| data[].passingScore | number | Passing score threshold |
| data[].totalQuestions | number | Total number of questions |
| data[].createdAt | string (ISO 8601) | Test creation timestamp |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 500 | "Internal server error" | Server error during tests retrieval |

---

## 14. Get Test Details

### API Name
Retrieve Single Test

### Endpoint URL
`/tests/:testId`

### HTTP Method
`GET`

### Description
Retrieves detailed information about a specific test including all questions and options.

### Request Headers
```
Content-Type: application/json
```

### Request Payload
No request body required.

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| testId | string (ObjectId) | Yes | MongoDB ObjectId of the test (in URL path) |

### Sample Request
```javascript
const getTestDetails = async (testId) => {
  const response = await fetch(
    `http://localhost:5000/api/tests/${testId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439050",
    "title": "JavaScript Fundamentals Assessment",
    "description": "Test your JavaScript skills",
    "duration": 60,
    "passingScore": 70,
    "totalQuestions": 25,
    "instructions": "Answer all questions within the time limit",
    "publishedStatus": true,
    "questions": [
      {
        "id": "507f1f77bcf86cd799439060",
        "questionText": "What is a closure in JavaScript?",
        "questionType": "multiple-choice",
        "options": [
          "A function that has access to variables in its scope",
          "A method to close a JavaScript file",
          "A type of loop construct",
          "None of the above"
        ],
        "difficulty": "medium"
      }
    ],
    "createdAt": "2026-03-05T10:40:00Z"
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if request was successful |
| data | object | Test data object |
| data.id | string (ObjectId) | Unique test identifier |
| data.title | string | Test title |
| data.description | string | Test description |
| data.duration | number | Test duration in minutes |
| data.passingScore | number | Passing score threshold |
| data.totalQuestions | number | Total number of questions |
| data.instructions | string | Test instructions |
| data.publishedStatus | boolean | Publication status |
| data.questions | array | Array of test questions |
| data.questions[].id | string (ObjectId) | Question identifier |
| data.questions[].questionText | string | Question content |
| data.questions[].questionType | string | Type of question |
| data.questions[].options | array | Answer options |
| data.questions[].difficulty | string | Difficulty level |
| data.createdAt | string (ISO 8601) | Test creation timestamp |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 404 | "Test not found" | Test ID does not exist |
| 500 | "Internal server error" | Server error during test retrieval |

---

# Interview APIs

## 15. Schedule Interview (Admin Only)

### API Name
Create Interview Schedule

### Endpoint URL
`/interviews`

### HTTP Method
`POST`

### Description
Schedules an interview for a candidate who has been shortlisted. Admin-only endpoint. Requires candidate ID, job ID, and interview date/time.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
```json
{
  "candidateId": "507f1f77bcf86cd799439011",
  "jobId": "507f1f77bcf86cd799439017",
  "interviewDate": "2026-04-15T14:30:00Z",
  "interviewType": "video-call",
  "interviewer": "507f1f77bcf86cd799439012",
  "notes": "Please prepare design portfolio samples"
}
```

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| candidateId | string (ObjectId) | Yes | MongoDB ObjectId of candidate |
| jobId | string (ObjectId) | Yes | MongoDB ObjectId of job role |
| interviewDate | string (ISO 8601) | Yes | Interview date and time |
| interviewType | string | Yes | Type of interview (phone, video-call, in-person) |
| interviewer | string (ObjectId) | Yes | ObjectId of interviewer |
| notes | string | No | Additional interview notes |

### Sample Request
```javascript
const scheduleInterview = async (accessToken, interviewData) => {
  const response = await fetch('http://localhost:5000/api/interviews', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      candidateId: '507f1f77bcf86cd799439011',
      jobId: '507f1f77bcf86cd799439017',
      interviewDate: '2026-04-15T14:30:00Z',
      interviewType: 'video-call',
      interviewer: '507f1f77bcf86cd799439012'
    }),
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "message": "Interview scheduled successfully",
  "data": {
    "id": "507f1f77bcf86cd799439070",
    "candidateId": "507f1f77bcf86cd799439011",
    "candidateName": "John Doe",
    "jobId": "507f1f77bcf86cd799439017",
    "interviewDate": "2026-04-15T14:30:00Z",
    "interviewType": "video-call",
    "interviewer": "507f1f77bcf86cd799439012",
    "status": "scheduled",
    "createdAt": "2026-03-05T11:00:00Z"
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if scheduling was successful |
| message | string | Success message |
| data | object | Interview schedule data |
| data.id | string (ObjectId) | Unique interview identifier |
| data.candidateId | string (ObjectId) | Candidate user ID |
| data.candidateName | string | Candidate's full name |
| data.jobId | string (ObjectId) | Job role ID |
| data.interviewDate | string (ISO 8601) | Scheduled interview date/time |
| data.interviewType | string | Type of interview |
| data.interviewer | string (ObjectId) | Interviewer user ID |
| data.status | string | Interview status |
| data.createdAt | string (ISO 8601) | Schedule creation timestamp |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "Candidate ID is required" | Candidate ID not provided |
| 400 | "Interview date is required" | Interview date not provided |
| 400 | "Interview type is invalid" | Invalid interview type |
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 403 | "Forbidden" | User does not have admin role |
| 404 | "Candidate not found" | Candidate ID does not exist |
| 500 | "Internal server error" | Server error during scheduling |

---

## 16. Get My Interviews

### API Name
Retrieve User's Interviews

### Endpoint URL
`/interviews/me`

### HTTP Method
`GET`

### Description
Retrieves all interviews for the authenticated user (candidate or interviewer).

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
No request body required.

### Request Parameters
No query parameters required.

### Sample Request
```javascript
const getMyInterviews = async (accessToken) => {
  const response = await fetch('http://localhost:5000/api/interviews/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439070",
      "candidateId": "507f1f77bcf86cd799439011",
      "candidateName": "John Doe",
      "jobId": "507f1f77bcf86cd799439017",
      "jobTitle": "Senior Frontend Developer",
      "interviewDate": "2026-04-15T14:30:00Z",
      "interviewType": "video-call",
      "status": "scheduled",
      "createdAt": "2026-03-05T11:00:00Z"
    }
  ]
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if request was successful |
| data | array | Array of interview objects |
| data[].id | string (ObjectId) | Unique interview identifier |
| data[].candidateId | string (ObjectId) | Candidate user ID |
| data[].candidateName | string | Candidate's full name |
| data[].jobId | string (ObjectId) | Job role ID |
| data[].jobTitle | string | Job position title |
| data[].interviewDate | string (ISO 8601) | Interview date/time |
| data[].interviewType | string | Type of interview |
| data[].status | string | Interview status |
| data[].createdAt | string (ISO 8601) | Schedule creation timestamp |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 500 | "Internal server error" | Server error during interviews retrieval |

---

# Skill APIs

## 17. Create Skill (Admin Only)

### API Name
Add New Skill

### Endpoint URL
`/skills`

### HTTP Method
`POST`

### Description
Creates a new skill in the system that can be associated with job roles. Admin-only endpoint.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
```json
{
  "name": "React",
  "category": "Frontend Development",
  "description": "JavaScript library for building user interfaces"
}
```

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| name | string | Yes | Skill name |
| category | string | No | Skill category |
| description | string | No | Skill description |

### Sample Request
```javascript
const createSkill = async (accessToken, skillData) => {
  const response = await fetch('http://localhost:5000/api/skills', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'React',
      category: 'Frontend',
      description: 'React library for UI'
    }),
    credentials: 'include'
  });
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "name": "React",
    "category": "Frontend Development",
    "description": "JavaScript library for building user interfaces",
    "createdAt": "2026-03-05T11:10:00Z"
  }
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if skill creation was successful |
| data | object | Created skill data |
| data.id | string (ObjectId) | Unique skill identifier |
| data.name | string | Skill name |
| data.category | string | Skill category |
| data.description | string | Skill description |
| data.createdAt | string (ISO 8601) | Skill creation timestamp |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 400 | "Skill name is required" | Name field is missing |
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 403 | "Forbidden" | User does not have admin role |
| 409 | "Skill already exists" | Skill name already registered |
| 500 | "Internal server error" | Server error during skill creation |

---

## 18. Get All Skills

### API Name
Retrieve Skills List

### Endpoint URL
`/skills`

### HTTP Method
`GET`

### Description
Retrieves all available skills in the system. Can be filtered and searched.

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
Cookie: token=<token_value>
```

### Request Payload
No request body required.

### Request Parameters

| Field Name | Type | Required | Description |
|---|---|---|---|
| search | string | No | Search term to filter skills |
| category | string | No | Filter by skill category |

### Sample Request
```javascript
const getAllSkills = async (accessToken, searchTerm = '') => {
  const queryParams = new URLSearchParams({
    search: searchTerm
  });
  
  const response = await fetch(
    `http://localhost:5000/api/skills?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
  );
  return await response.json();
};
```

### Sample Response
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439014",
      "name": "React",
      "category": "Frontend Development",
      "description": "JavaScript library for building user interfaces"
    },
    {
      "id": "507f1f77bcf86cd799439015",
      "name": "Node.js",
      "category": "Backend Development",
      "description": "JavaScript runtime for server-side development"
    }
  ]
}
```

### Response Fields

| Field Name | Type | Description |
|---|---|---|
| success | boolean | Indicates if request was successful |
| data | array | Array of skill objects |
| data[].id | string (ObjectId) | Unique skill identifier |
| data[].name | string | Skill name |
| data[].category | string | Skill category |
| data[].description | string | Skill description |

### Possible Error Responses

| Status Code | Error Message | Reason |
|---|---|---|
| 401 | "Unauthorized" | JWT token is missing or invalid |
| 500 | "Internal server error" | Server error during skills retrieval |

---

## Common Error Response Format

All API errors follow this standard format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

---

## Authentication & Authorization

### JWT Token Details
- **Access Token Lifespan**: 1 hour (3600 seconds)
- **Refresh Token Lifespan**: 7 days
- **Token Type**: Bearer Token
- **Storage**: HTTP-only cookies (automatic)

### Roles
- **admin**: Full access to all endpoints
- **candidate**: Can apply for jobs, view tests, schedule interviews
- **recruiter**: Can create jobs, view applications, schedule interviews
- **user**: Limited access to personal profile and public data

### Bearer Token Usage
Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Best Practices

1. **Always include credentials** when making cross-origin requests to ensure cookies are sent
2. **Store tokens securely** in HTTP-only cookies (handled by server)
3. **Handle token expiration** by listening for 401 responses and refreshing the token
4. **Validate on client side** before submitting forms to the API
5. **Use pagination** for endpoints that return large datasets
6. **Implement proper error handling** and display user-friendly messages
7. **Use HTTPS** in production to protect sensitive data in transit

---

## Rate Limiting

Currently, no rate limiting is enforced. However, applications should implement reasonable request patterns to avoid server overload.

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-03-05 | Initial API documentation for core endpoints |

---

## Support & Feedback

For API issues, bugs, or feature requests, please contact the development team or submit an issue through the project repository.

