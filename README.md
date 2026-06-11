#  Recruitment-Server (Kodr)

**AI-Powered Recruitment Platform Backend**

_Enterprise-grade, production-ready backend for managing job applications, AI-driven testing, candidate evaluation, and recruitment workflows._

---

##  Table of Contents

1. [Backend Overview](#1-backend-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Redis Usage](#4-redis-usage)
5. [Email System](#5-email-system)
6. [Data Flow](#6-data-flow)
7. [Database Design](#7-database-design)
8. [API Design](#8-api-design)
9. [Security](#9-security)
10. [Scalability](#10-scalability)
11. [Performance](#11-performance)
12. [Background Jobs](#12-background-jobs)
13. [Logging & Monitoring](#13-logging--monitoring)
14. [DevOps](#14-devops)
15. [Folder Structure](#15-folder-structure)

---

## 1. Backend Overview

### Problem Solved

- **Inefficient Recruitment**: Manual screening of applications wastes time
- **Lack of Fair Assessment**: Need standardized, AI-driven technical testing
- **Candidate Experience**: Poor communication and interview scheduling
- **Scalability**: Support 10K+ concurrent users with real-time job matching

### Core Responsibilities

✅ **User Management**: HR, Candidates, Admins with RBAC
✅ **Job & Application Management**: Post jobs, track applications
✅ **AI Testing**: Generate & evaluate tests using LangChain + Groq
✅ **Interview Scheduling**: Manage interview slots & notifications
✅ **Async Communication**: Email notifications, notifications queue
✅ **File Management**: Resume parsing, cloud storage (Cloudinary/S3)

### High-Level System Context

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React/Vue)                    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ↓
         ┌───────────────────────────────────┐
         │    Express API Gateway            │
         │  (CORS, Auth, Rate Limiting)      │
         └────────┬────────────────────┬─────┘
                  │                    │
          ┌───────↓───────┐    ┌──────↓──────┐
          │   Services    │    │  Workers    │
          │  (Business    │    │  (BullMQ)   │
          │   Logic)      │    │  Async Jobs │
          └───────┬───────┘    └──────┬──────┘
                  │                    │
          ┌───────↓─────────────────────↓────┐
          │    MongoDB    │    Redis Cache   │
          │  (Persistent) │  (Hot Data/Queues)
          └──────────────────────────────────┘
```

---

## 2. Architecture

### Architectural Style: **Monolithic**

**Justification:**

- Single business domain (recruitment)
- Shared database schema
- Easier debugging & deployment
- Better for startup phase (growth ≤ 1M users)
- Can transition to microservices when modules decouple

### Layered Architecture (MVC + Clean Architecture)

```
┌──────────────────────────────────┐
│     Routes (Entry Points)        │
└──────────────────┬───────────────┘
                   │
┌──────────────────↓───────────────┐
│  Controllers (Request Handler)   │  ← Handle HTTP requests
│  - Validate input               │
│  - Call services                │
│  - Return responses             │
└──────────────────┬───────────────┘
                   │
┌──────────────────↓───────────────┐
│  Services (Business Logic)       │  ← Core logic
│  - Auth, User, Job, Test         │
│  - Orchestrate operations        │
│  - Call repositories             │
└──────────────────┬───────────────┘
                   │
┌──────────────────↓───────────────┐
│  Repositories (Data Access)      │  ← MongoDB queries
│  - User.findById()               │
│  - Job.find()                    │
│  - Abstract DB from business     │
└──────────────────┬───────────────┘
                   │
┌──────────────────↓───────────────┐
│  Models (Domain Entities)        │  ← Mongoose schemas
│  - User, Job, Test, Application  │
│  - Data structure & validation   │
└──────────────────────────────────┘
```

### Request Lifecycle

```
1. Client Request
   ↓
2. Express Middleware
   - Parse JSON, cookies
   - CORS validation
   ↓
3. Route Matching → Controller
   ↓
4. Middleware Chain
   - authenticateJWT() → Verify token
   - checkEnrollment() → Validate permissions
   - errorHandler() → Catch errors
   ↓
5. Controller
   - Validate request body (Joi)
   - Call Service
   ↓
6. Service Layer
   - Business logic
   - Call Repository
   - Access Redis cache
   ↓
7. Repository
   - MongoDB query
   - Return data
   ↓
8. Cache Layer (Redis)
   - Store frequently accessed data
   ↓
9. Response
   - Format JSON
   - Set cookies (JWT)
   - Send to client
```

---

## 3. Tech Stack

### Core Framework

| Component     | Technology              | Version | Purpose              |
| ------------- | ----------------------- | ------- | -------------------- |
| **Runtime**   | Node.js                 | 18+     | JavaScript runtime   |
| **Framework** | Express.js              | 5.2.1   | HTTP server, routing |
| **Language**  | JavaScript (ES Modules) | ES2022  | Modern async/await   |

### Database & Persistence

| Component      | Technology | Version | Purpose                       |
| -------------- | ---------- | ------- | ----------------------------- |
| **Primary DB** | MongoDB    | 6.0+    | NoSQL for flexibility         |
| **ODM**        | Mongoose   | 8.18.2  | Schema validation, population |
| **Caching**    | Redis      | 5.8.2   | Hot data, sessions, queues    |

**Why MongoDB?**

- Flexible schema (users, jobs, tests differ structurally)
- Rapid prototyping
- Good for hierarchical data (job → skills → requirements)
- Scales horizontally with sharding

### Authentication & Security

| Component         | Technology                 | Purpose                 |
| ----------------- | -------------------------- | ----------------------- |
| **JWT**           | jsonwebtoken 9.0.2         | Access & refresh tokens |
| **Password**      | bcryptjs 3.0.2             | Secure password hashing |
| **Token Storage** | Redis + Cookies            | Blacklist logout tokens |
| **OAuth2**        | (Optional) Google/LinkedIn | Social login            |

### File Storage

| Component         | Technology                      | Purpose                |
| ----------------- | ------------------------------- | ---------------------- |
| **Cloud Storage** | Cloudinary 2.8.0                | Resume uploads, images |
| **AWS S3**        | aws-sdk v2 + @aws-sdk/client-s3 | S3 presigned URLs      |
| **File Parser**   | pdf-parse 1.1.1                 | Resume extraction      |

### Email Service

| Component     | Technology        | Purpose                   |
| ------------- | ----------------- | ------------------------- |
| **Primary**   | Nodemailer 7.0.11 | SMTP/SendGrid integration |
| **Secondary** | Resend 6.5.2      | Transactional emails      |
| **Queue**     | BullMQ 5.65.1     | Async email processing    |

### AI & ML

| Component   | Technology             | Purpose                |
| ----------- | ---------------------- | ---------------------- |
| **LLM**     | Groq (@langchain/groq) | Fast AI inference      |
| **Graph**   | LangGraph 0.4.9        | Workflow orchestration |
| **Parsing** | LangChain              | Prompt engineering     |

### Queue & Jobs

| Component      | Technology      | Purpose                 |
| -------------- | --------------- | ----------------------- |
| **Queue**      | BullMQ 5.65.1   | Job processing, retries |
| **Connection** | Redis           | Queue backend           |
| **Consumers**  | Node.js Workers | Process background jobs |

### Validation & Utilities

| Component             | Technology     | Purpose                    |
| --------------------- | -------------- | -------------------------- |
| **Schema Validation** | Joi 18.0.1     | Request payload validation |
| **File Upload**       | Multer 2.0.2   | Resume uploads             |
| **Logging**           | Winston 3.17.0 | Structured logging         |
| **HTTP Client**       | Axios 1.13.2   | External API calls         |
| **Environment**       | dotenv 17.2.3  | Config management          |

---

## 4. Redis Usage

### Caching Strategy

**Hot Data Storage** (Reduced DB queries)

```
Key Pattern: cache:{entity}:{id}
Example: cache:user:507f1f77bcf86cd799439011

TTL:
  - User profile: 1 hour
  - Job listings: 30 minutes
  - Test questions: 24 hours

Eviction Policy: LRU (Least Recently Used)
Max Memory: 2GB (adjust based on load)
```

### Session Store

```javascript
// After login, store user session
await redisClient.setEx(
  `session:${userId}`,
  24 * 60 * 60, // 24 hours
  JSON.stringify(userSession)
);
```

### Token Blacklist (Logout)

```javascript
// On logout, blacklist JWT
await redisClient.setEx(
  `bl_${token}`,
  expiryTime, // TTL = token expiry time
  'true'
);
```

### Rate Limiting

```
Key: rate_limit:{userId}:{endpoint}
Max: 100 requests per minute
TTL: 60 seconds (auto-reset)
```

### Background Jobs Queue

```javascript
// Email job example
await emailQueue.add(
  'send-email',
  {
    to: 'candidate@email.com',
    subject: 'Interview Scheduled',
    template: 'interview-reminder',
  },
  {
    attempts: 6, // Retry 6 times
    backoff: exponential, // 5s → 10s → 20s...
    removeOnComplete: true,
    removeOnFail: false, // Keep failed jobs for debugging
  }
);
```

---

## 5. Email System

### Architecture

```
User Action (Apply Job)
    ↓
Controller
    ↓
Add to Redis Queue (emailQueue)
    ↓
Return response immediately ⚡
    ↓
Worker Process (emailWorker.js)
    ↓
Pick job from queue
    ↓
Nodemailer/Resend
    ↓
SMTP/API send
    ↓
Retry on failure (exponential backoff)
```

### Providers

| Provider       | Use Case               | Speed  |
| -------------- | ---------------------- | ------ |
| **Nodemailer** | SMTP (self-hosted)     | ~1-2s  |
| **Resend**     | Transactional (modern) | ~500ms |

### Templates

```
└── templates/
    ├── job-application-confirmation.html
    ├── interview-scheduled.html
    ├── test-invitation.html
    ├── password-reset.html
    └── welcome-email.html
```

### Retry & Failure Handling

- **Exponential Backoff**: 5s → 10s → 20s → 40s → 80s → 160s
- **Dead Letter Queue** (DLQ): Failed jobs after 6 retries stored for analysis
- **Monitoring**: Track success/failure rates in Redis

### Security

- ✅ SPF records configured
- ✅ DKIM signing enabled
- ✅ Environment variables for secrets
- ✅ API key rotation support

---

## 6. Data Flow

### End-to-End Request Flow: Job Application

```
1️⃣  Candidate clicks "Apply Job"
    └─ POST /api/job-apply
       Payload: { jobId, candidateId, resume }

2️⃣  Controller receives request
    └─ authenticateJWT middleware
    └─ validatePayload (Joi)

3️⃣  Service processes
    └─ Check job exists
    └─ Check candidate not already applied
    └─ Create JobApplication document
    └─ Queue email job
    └─ Update job application count (cache invalidate)

4️⃣  Repository saves
    └─ MongoDB: jobApplication.create()
    └─ Mongoose: auto-populate references

5️⃣  Cache invalidated
    └─ Redis: DEL cache:job:{jobId}

6️⃣  Email queued
    └─ BullMQ: emailQueue.add()
    └─ Worker picks up asynchronously

7️⃣  Response sent to client
    └─ { success: true, data: application }

8️⃣  (Async) Worker sends email
    └─ Candidate receives confirmation
```

### Authentication Flow

```
1. Login (POST /api/auth/login)
   └─ Validate email + password
   └─ Hash comparison (bcrypt)

2. Generate Tokens
   ├─ Access Token (JWT, 1 hour)
   ├─ Refresh Token (JWT, 7 days)
   └─ User verified check

3. Set Cookies
   ├─ token: httpOnly, Secure, SameSite
   ├─ refreshToken: httpOnly, Secure, SameSite
   └─ Store in Redis session store

4. Protected Requests
   ├─ authenticateJWT middleware
   ├─ Extract token from header/cookie
   ├─ Check Redis blacklist
   ├─ Verify JWT signature
   └─ Attach user data to req object

5. Refresh Flow
   ├─ Access token expired? → POST /api/auth/refresh
   ├─ Validate refresh token
   ├─ Issue new access token
   └─ Update cookies
```

### AI Test Generation Flow

```
Recruiter: "Generate JavaScript Test"
    ↓
POST /api/ai/generate-test
    ├─ jobRoleId, difficulty, questionCount
    ↓
Service calls LangChain → Groq
    ├─ LangGraph workflow
    ├─ Prompt engineering
    ├─ Structure response (JSON)
    ↓
Save to MongoDB (AITest collection)
    ├─ Store questions + solutions
    ├─ Set difficulty level
    ↓
Respond with test ID
    ↓
Recruiter enrolls candidates
    ├─ POST /api/enrollments
    ├─ Queue email notifications
    ↓
Candidate takes test
    ├─ Submit answers
    ├─ AI evaluates (AnswerEvaluator agent)
    ├─ Generate score + feedback
    ├─ Send results email
```

---

## 7. Database Design

### Collections Overview

```
User
├─ _id, email, password (hashed)
├─ firstName, lastName
├─ roleId → Role (reference)
├─ isVerified, timestamps
└─ Index: email (unique), roleId

Role
├─ _id, name (HR, Candidate, Admin)
├─ permissions → [Permission IDs]
└─ Index: name (unique)

JobRole
├─ _id, title, description
├─ skills → [Skill IDs]
├─ experienceRequired
├─ salary, location
└─ Index: title, location

JobApplication
├─ _id, jobId → JobRole
├─ candidateId → User
├─ resume (file path)
├─ status (applied, reviewing, rejected, offered)
├─ appliedAt, timestamps
└─ Index: jobId, candidateId (compound)

Tests
├─ _id, title, description
├─ jobRoleId → JobRole
├─ questions → [Question objects]
├─ difficulty (easy/medium/hard)
├─ duration, passingScore
└─ Index: jobRoleId

TestEnrollments
├─ _id, testId → Tests
├─ candidateId → User
├─ enrolledAt, startedAt, submittedAt
├─ status (pending, in-progress, completed)
└─ Index: testId, candidateId (compound)

TestAttempts
├─ _id, testId, candidateId
├─ answers → [{ questionId, answer, isCorrect }]
├─ score, duration
├─ submittedAt
└─ Index: testId, candidateId

ScheduleInterview
├─ _id, jobApplicationId → JobApplication
├─ scheduledDate, duration
├─ interviewerId → User
├─ status (scheduled, completed, cancelled)
└─ Index: candidateId, scheduledDate
```

### Indexing Strategy

```javascript
// High-cardinality fields (optimize read queries)
db.jobApplication.createIndex({ jobId: 1, status: 1 });
db.testAttempts.createIndex({ candidateId: 1, submittedAt: -1 });
db.user.createIndex({ email: 1 }, { unique: true });

// Text search indexes
db.jobRole.createIndex({ title: 'text', description: 'text' });
```

### Transactions (ACID)

```javascript
// Multi-document transaction example
const session = await mongoose.startSession();
session.startTransaction();

try {
  await JobApplication.create([{ ... }], { session });
  await Job.updateOne({ _id: jobId }, { $inc: { applicantCount: 1 } }, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
}
```

---

## 8. API Design

### REST Conventions

```
Resource        Verb      Action
─────────────────────────────────────────
/api/jobs       GET       List jobs
/api/jobs       POST      Create job
/api/jobs/:id   GET       Get job details
/api/jobs/:id   PUT       Update job
/api/jobs/:id   DELETE    Delete job

/api/job-apply  POST      Submit application
/api/test-attempts POST   Submit test answers
```

### Response Structure

```javascript
// Success (200)
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 50 }
}

// Error (400/401/500)
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Invalid credentials",
    "details": { ... }
  }
}
```

### Pagination & Filtering

```javascript
// Request
GET /api/jobs?page=1&limit=10&status=active&location=NYC

// Response
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

### Error Structure

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Usage
throw new AppError('User not found', 404);
throw new AppError('Unauthorized', 401);
throw new AppError('Validation failed', 400);
```

### API Versioning (Future)

```
/api/v1/jobs       ← Current
/api/v2/jobs       ← Future (breaking changes)
```

---

## 9. Security

### JWT Lifecycle

```
Access Token (1 hour TTL)
├─ Payload: { id, email, role, isVerified }
├─ Signed with HS256 (JWT_SECRET)
├─ Stored in httpOnly cookie
└─ Verified on each request

Refresh Token (7 days TTL)
├─ Payload: { id }
├─ Stored in httpOnly cookie
├─ Used to issue new access tokens
└─ One per user (no concurrent tokens)
```

### Token Blacklist (Logout)

```javascript
// On logout
await redisClient.setEx(
  `bl_${token}`,
  token.expiresIn, // TTL = remaining validity
  'true'
);

// On every request
const isBlacklisted = await redisClient.get(`bl_${token}`);
if (isBlacklisted) throw new AppError('Token revoked', 401);
```

### RBAC (Role-Based Access Control)

```javascript
// Roles defined in DB
Candidate: {
  permissions: ['apply_job', 'take_test'];
}
HR: {
  permissions: ['post_job', 'schedule_interview', 'view_candidates'];
}
Admin: {
  permissions: ['manage_roles', 'manage_users'];
}

// Middleware enforcement
export const authorizeRole = requiredRoles => {
  return (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
};

// Usage
router.post('/api/jobs', authenticateJWT, authorizeRole(['HR']), createJob);
```

### API Rate Limiting

```javascript
// Per-user rate limit via Redis
Key: rate_limit:{userId}:{endpoint}
Limit: 100 requests/minute
Violate: Return 429 (Too Many Requests)
```

### Input Validation

```javascript
// Joi schema example
const createJobSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  salary: Joi.number().positive().required(),
  skills: Joi.array().items(Joi.string()).min(1).required(),
});

// Validate request
await createJobSchema.validateAsync(req.body);
```

### CORS & CSRF

```javascript
// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// CSRF: Protected via httpOnly cookies + SameSite=Strict
// No explicit CSRF tokens needed for JSON APIs
```

### Secrets Management

```
.env (never commit)
├─ JWT_SECRET
├─ MONGO_URI
├─ REDIS_PASSWORD
├─ AWS_ACCESS_KEY_ID
├─ AWS_SECRET_ACCESS_KEY
├─ GROQ_API_KEY
└─ SENDGRID_API_KEY

// In production:
// → Use AWS Secrets Manager / HashiCorp Vault
// → Rotate secrets quarterly
// → Enable audit logging
```

---

## 10. Scalability

### Horizontal Scaling Strategy

```
Client Requests
    ↓
Load Balancer (Nginx/HAProxy)
    ├─ Server 1 (Node.js)
    ├─ Server 2 (Node.js)
    ├─ Server 3 (Node.js)
    └─ Server N (Node.js)

All connected to:
├─ Shared MongoDB (Primary + 2 Replicas)
├─ Shared Redis (Cluster mode: 6 nodes)
└─ Shared S3 / Cloudinary
```

### Stateless Services

```
Every Node instance is identical:
✓ No in-memory state
✓ All sessions in Redis
✓ All files in cloud storage
✓ All queues in Redis/BullMQ
→ Can kill/restart any instance without data loss
```

### Database Replication

```
MongoDB Replica Set:
├─ Primary (writes)
├─ Secondary 1 (read-only)
├─ Secondary 2 (read-only)
└─ Arbiter (voting only)

Benefits:
✓ High availability
✓ Automatic failover
✓ Read scaling (distribute reads to secondaries)
```

### Redis Cluster

```
Single Redis instance → Multiple nodes:
├─ 3 master nodes (data)
├─ 3 slave nodes (replicas)
├─ Hash slots distributed (0-16383)
└─ Auto-failover if master goes down

Capacity: Scale from 2GB → 100GB+
```

---

## 11. Performance

### Caching Layers

```
1. Browser Cache (Frontend)
   └─ Static assets: 30 days

2. HTTP Cache Headers (API)
   └─ Cache-Control: private, max-age=300
   └─ ETag, Last-Modified

3. Redis Cache (Hot Data)
   └─ User profiles: 1h TTL
   └─ Job listings: 30m TTL
   └─ Test questions: 24h TTL

4. Database Indexes
   └─ B-tree indexes on frequently queried fields
   └─ Compound indexes for multi-field queries
```

### Query Optimization

```javascript
// ❌ Bad: N+1 queries
const jobs = await Job.find();
for (let job of jobs) {
  const role = await JobRole.findById(job.roleId); // 100 queries!
}

// ✅ Good: Eager loading
const jobs = await Job.find().populate('roleId');

// ✅ Better: Selective fields
const jobs = await Job.find().select('title salary').populate('roleId', 'name skills');

// ✅ Best: Caching
const cached = await redisClient.get('cache:jobs:list');
if (cached) return JSON.parse(cached);
```

### Async Processing

```
Sync (blocking):
POST /apply → Save → Queue → Respond (3 seconds)

Async (non-blocking):
POST /apply → Queue immediately → Respond (100ms)
            → Worker processes email in background

Benefits: Faster API response, better UX
```

### CDN Strategy

```
Cloudinary (Image CDN):
├─ Optimize resume thumbnails
├─ Auto-resize based on device
├─ Lazy loading
└─ Geographic distribution

S3 (Object Storage):
├─ Resume PDFs
├─ Store in regional buckets
└─ Presigned URLs for direct download
```

---

## 12. Background Jobs

### BullMQ Queue System

```javascript
// Queue definition
export const emailQueue = new Queue('email', {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 6,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Add job
await emailQueue.add('send-email', {
  to: 'candidate@email.com',
  subject: 'Interview Scheduled',
  template: 'interview-reminder',
});

// Process job
emailQueue.process('send-email', async job => {
  await sendEmail(job.data);
  return { success: true };
});
```

### Workers

```
emailWorker.js (runs continuously):
├─ Pick job from queue
├─ Process (send email)
├─ Mark complete or retry
└─ Log results

Multiple workers can run:
├─ Worker 1 (8 threads)
├─ Worker 2 (8 threads)
├─ Worker 3 (8 threads)
└─ Scale up/down based on queue length
```

### Retry & Dead Letter Queue (DLQ)

```
Job flow:
Add → Attempt 1 ❌ → Wait 5s
           ↓
        Attempt 2 ❌ → Wait 10s
           ↓
        Attempt 3 ❌ → Wait 20s
           ↓
        ... (6 total)
           ↓
        Final fail → DLQ (investigate manually)
```

### Cron Jobs (Future)

```javascript
// Schedule test reminders daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  const pendingTests = await TestEnrollment.find({ status: 'pending' });
  for (let test of pendingTests) {
    await emailQueue.add('test-reminder', test);
  }
});
```

---

## 13. Logging & Monitoring

### Winston Logger

```javascript
import logger from "./utils/logger.js";

logger.info("User registered", { userId, email });
logger.error("Database error", { error: err.message });
logger.warn("High memory usage", { memory: "85%" });

// Log format
{
  timestamp: "2026-01-24T10:30:45Z",
  level: "error",
  message: "MongoDB connection failed",
  error: "ECONNREFUSED",
  context: { userId: "123" }
}
```

### Log Levels

```
ERROR   → Critical issues (db down, auth failed)
WARN    → Warnings (high latency, deprecated API)
INFO    → General info (user registered, job applied)
DEBUG   → Debug details (query execution, variable values)
```

### Future: ELK Stack

```
Logs → Elasticsearch → Kibana (dashboards)
                   ↓
                Logstash (parse/enrich)

Dashboards:
├─ Request latency percentiles (p50, p95, p99)
├─ Error rate by endpoint
├─ Queue job success rate
└─ Database query performance
```

### Monitoring & Alerts

```
Prometheus metrics (future):
├─ HTTP request duration
├─ Queue job count
├─ Cache hit ratio
├─ Database connection pool

Grafana dashboards:
├─ Real-time request rates
├─ Error spike detection
├─ Resource utilization
└─ Alert on anomalies
```

---

## 14. DevOps

### Docker Setup

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - '5000:5000'
    environment:
      - MONGO_URI=mongodb://mongo:27017/kodr
      - REDIS_HOST=redis
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:6.0
    ports:
      - '27017:27017'

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Lint
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t kodr:latest .
      - name: Deploy to production
        run: ./scripts/deploy.sh
```

### Zero-Downtime Deploy

```bash
# Blue-Green Deployment:
# 1. Deploy new version (Green)
# 2. Health checks pass?
# 3. Switch load balancer (Blue → Green)
# 4. Old version (Blue) can be rolled back
# 5. Zero downtime ✓

# Rolling updates:
# Scale: 3 → 4 instances
#     ↓
# Deploy on 4th instance
#     ↓
# Health check OK
#     ↓
# Remove 1st instance
#     ↓
# Continue rolling...
```

### Environment Separation

```
.env.development   → Local machine
.env.staging       → QA/testing environment
.env.production    → Live production

npm run dev        → Uses development config
npm run build      → Production optimized
```

---

## 15. Folder Structure

### Enterprise-Grade Organization

```
Recruitment-Server/
│
├── 📁 src/
│   ├── 📁 agents/                    ← AI agents (LangChain)
│   │   ├── AnswerEvaluator.js       (Evaluate test answers)
│   │   ├── QuestionGenerator.js     (Generate test questions)
│   │   └── TestGenerator.js
│   │
│   ├── 📁 config/                   ← Configuration
│   │   ├── database.js              (MongoDB connection)
│   │   ├── redis.js                 (Redis connection)
│   │   ├── environment.js           (Env variables)
│   │   ├── corsOptions.js           (CORS middleware)
│   │   └── bullmq-connection.js     (BullMQ config)
│   │
│   ├── 📁 controllers/              ← HTTP request handlers
│   │   ├── auth.controller.js       (Login, register, refresh)
│   │   ├── user.controller.js       (CRUD operations)
│   │   ├── jobRole.controller.js
│   │   ├── jobApplication.controller.js
│   │   ├── ai.controller.js         (AI test endpoints)
│   │   ├── testAttempts.controller.js
│   │   └── scheduleInterview.controller.js
│   │
│   ├── 📁 services/                 ← Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── job.service.js
│   │   ├── ai.service.js            (LLM calls)
│   │   └── email.service.js         (Email logic)
│   │
│   ├── 📁 repositories/             ← Data access layer
│   │   ├── contracts/               (Interfaces)
│   │   ├── implementations/         (Mongoose queries)
│   │   ├── user.repository.js
│   │   └── job.repository.js
│   │
│   ├── 📁 models/                   ← Mongoose schemas
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   ├── Tests.js
│   │   ├── TestEnrollments.js
│   │   ├── TestAttempts.js
│   │   └── AITest.js
│   │
│   ├── 📁 routes/                   ← Express routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── jobApplication.routes.js
│   │   ├── ai.routes.js
│   │   └── index.js                 (Centralized)
│   │
│   ├── 📁 middlewares/              ← Express middleware
│   │   ├── auth.middleware.js       (JWT verification)
│   │   ├── errorHandler.middleware.js
│   │   ├── role.middleware.js       (RBAC)
│   │   ├── checkEnrollment.middleware.js
│   │   └── multer.middleware.js     (File uploads)
│   │
│   ├── 📁 queues/                   ← BullMQ queues
│   │   └── emailQueue.js            (Email processing)
│   │
│   ├── 📁 workers/                  ← Background processors
│   │   └── emailWorker.js           (Process email jobs)
│   │
│   ├── 📁 utils/                    ← Utilities
│   │   ├── logger.js                (Winston logger)
│   │   ├── errors.js                (AppError class)
│   │   ├── validators.js            (Custom validators)
│   │   └── helpers.js
│   │
│   ├── 📁 lib/                      ← Libraries
│   │   ├── cleanCode.js
│   │   └── prompt/                  (AI prompts)
│   │
│   └── app.js                        ← Express app setup
│
├── 📁 logs/                          ← Log files
│   ├── error.log
│   └── combined.log
│
├── server.js                         ← Entry point
├── package.json
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
MongoDB 6.0+
Redis 7.0+
npm or yarn
```

### Installation

```bash
# 1. Clone repo
git clone <repo-url>
cd Kodr_server

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your config

# 4. Start services
docker-compose up -d

# 5. Run server + worker
npm run dev:all
```

### Running Services

```bash
# Development
npm run dev        # API server with nodemon
npm run worker:dev # Email worker with nodemon
npm run dev:all    # Both simultaneously

# Production
npm run start      # API server
npm run worker     # Email worker
npm run start:all  # Both simultaneously
```

---

## 📊 Key Metrics & KPIs

### Performance Targets

- **API Response Time**: p95 < 200ms, p99 < 500ms
- **Job Completion**: 99.9% (BullMQ retry policy)
- **Cache Hit Ratio**: > 70%
- **Database Query**: < 100ms (with indexes)

### Scaling Capacity

- **Concurrent Users**: 10,000+
- **Daily API Requests**: 1M+
- **Queue Jobs/Day**: 100K+
- **Database Size**: 500GB+ (with sharding)

---

## 🔐 Security Checklist

✅ JWT token blacklist (Redis)
✅ Password hashing (bcryptjs)
✅ CORS properly configured
✅ Rate limiting per user
✅ Input validation (Joi)
✅ Environment secrets (.env)
✅ HTTPOnly cookies for tokens
✅ Role-based access control (RBAC)
✅ Error messages don't leak sensitive data
✅ MongoDB indexes prevent injection

---

## 🛠️ Common Issues & Solutions

### Issue: Slow Database Queries

**Solution:**

```bash
# Check indexes
db.jobApplication.getIndexes()

# Add missing index
db.jobApplication.createIndex({ "jobId": 1, "status": 1 })
```

### Issue: High Memory Usage

**Solution:**

```bash
# Check Redis memory
redis-cli INFO memory

# Clear old sessions
redis-cli FLUSHDB ASYNC

# Increase Redis max memory in config
```

### Issue: Email Jobs Failing

**Solution:**

```bash
# Check DLQ (Dead Letter Queue)
const failedJobs = await emailQueue.getFailed();
console.log(failedJobs);

# Retry manually
for (let job of failedJobs) {
  await emailQueue.add(job.data);
}
```

### Issue: JWT Token Errors

**Solution:**

```bash
# Clear token blacklist
redis-cli DEL "bl_*"

# Check token in JWT.io (remove secret to verify payload)
```

---

## 📚 API Documentation

### Authentication

**POST** `/api/auth/register`

```json
Request: { "email": "user@example.com", "password": "..." }
Response: { "success": true, "data": { "userId", "token", "refreshToken" } }
```

**POST** `/api/auth/login`

```json
Request: { "email": "user@example.com", "password": "..." }
Response: { "success": true, "expiresIn": 3600, "data": {...} }
```

**POST** `/api/auth/refresh`

```json
Request: { }  (uses cookie)
Response: { "success": true }  (updates cookies)
```

**POST** `/api/auth/logout`

```json
Request: { }
Response: { "success": true }  (token added to blacklist)
```

### Jobs

**GET** `/api/jobs?page=1&limit=10`

```json
Response: { "data": [...], "pagination": {...} }
```

**POST** `/api/jobs` (HR only)

```json
Request: { "title": "Sr. Developer", "salary": 120000, "skills": ["JS", "React"] }
Response: { "success": true, "data": { "jobId", "createdAt" } }
```

**POST** `/api/job-apply` (Candidate)

```json
Request: { "jobId": "...", "resume": "file" }
Response: { "success": true, "data": { "applicationId" } }
```

### AI Tests

**POST** `/api/ai/generate-test`

```json
Request: { "jobRoleId": "...", "difficulty": "medium", "questionCount": 10 }
Response: { "success": true, "data": { "testId", "questions": [...] } }
```

**POST** `/api/tests/:testId/enroll` (Admin)

```json
Request: { "candidateIds": ["...", "..."] }
Response: { "success": true, "enrolled": 5 }
```

**POST** `/api/test-attempts` (Candidate)

```json
Request: { "testId": "...", "answers": [{ "questionId": "...", "answer": "..." }] }
Response: { "success": true, "score": 85, "feedback": "..." }
```

### Interviews

**POST** `/api/interviews/schedule`

```json
Request: { "applicationId": "...", "scheduledDate": "2026-02-15T10:00:00Z", "duration": 60 }
Response: { "success": true, "data": { "interviewId", "confirmationSent": true } }
```

---

## 🧪 Testing Strategy

### Unit Tests (Controllers & Services)

```bash
npm test -- src/services/auth.service.test.js
```

### Integration Tests (API endpoints)

```bash
npm test -- src/routes/auth.routes.test.js
```

### Load Testing (Performance)

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/jobs

# Using Artillery
artillery quick --count 100 --num 1000 http://localhost:5000/api/jobs
```

---

## 📈 Monitoring & Logs

### View Logs

```bash
# API logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log

# Real-time logs
docker logs -f recruitment-api
```

### Monitor Queue

```bash
# Check queue status
curl http://localhost:5000/admin/queues  (if enabled)

# Or via Redis CLI
redis-cli LLEN bull:email:waiting
redis-cli LLEN bull:email:completed
```

### Database Monitoring

```bash
# MongoDB connection status
mongo --eval "db.adminCommand('ping')"

# Check indexes
mongo --eval "db.jobApplication.getIndexes()"
```

---

## 🔄 CI/CD Pipeline

### Automated Testing & Deployment

```
1. Push to main branch
   ↓
2. GitHub Actions triggers
   - Install dependencies
   - Run linting (ESLint)
   - Run unit tests
   - Run integration tests
   ↓
3. Build Docker image
   ↓
4. Push to registry
   ↓
5. Deploy to staging
   - Health checks
   - Smoke tests
   ↓
6. Deploy to production (if manual approval)
   - Blue-green deployment
   - Zero downtime
   ↓
7. Monitor & Alert
   - CPU, memory, requests
```

---

## 🎯 Next Steps & Roadmap

### Short Term (1-2 months)

- [ ] Add WebSocket support for real-time notifications
- [ ] Implement API caching layer (response-level)
- [ ] Add comprehensive error tracking (Sentry)
- [ ] Setup automated backup strategy

### Medium Term (3-6 months)

- [ ] Migrate to microservices (if needed)
  - Separate: Auth, Jobs, Tests, Notifications services
  - Event-driven with Kafka/RabbitMQ
- [ ] Add GraphQL layer (alongside REST)
- [ ] Implement distributed tracing (Jaeger)
- [ ] Add analytics & reporting module

### Long Term (6-12 months)

- [ ] Machine learning for candidate matching
- [ ] Video interview integration
- [ ] Advanced analytics dashboard
- [ ] Blockchain for credential verification

---

## 📞 Support & Contact

For issues, questions, or contributions:

- **Issue Tracker**: GitHub Issues
- **Email**: tech@recruitment-platform.com
- **Slack**: #backend-team

---

## 📄 License

MIT License - See LICENSE.md

---

## ✍️ Author & Contributors

**Built with ❤️ by the Recruitment Platform Team**

Last Updated: January 24, 2026
