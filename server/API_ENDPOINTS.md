# InterVueX REST API

Base URL for local Postman testing:

```txt
http://localhost:4000
```

Protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

AI question generation also requires this server environment variable:

```txt
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
```

Common error response:

```json
{
  "success": false,
  "message": "Invalid id"
}
```

Pagination query support:

```txt
?page=1&limit=10&sort=-createdAt
```

## Auth

### POST `/api/auth/register`

```json
{
  "fullName": "Khushi Kumari",
  "username": "khushi",
  "email": "khushi@example.com",
  "password": "Password123"
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Registered Successfully",
  "user": {
    "_id": "665f1c2a2c7a9d0a12345678",
    "fullName": "Khushi Kumari",
    "email": "khushi@example.com",
    "credits": 5
  },
  "token": "<JWT_TOKEN>"
}
```

### POST `/api/auth/login`

```json
{
  "email": "khushi@example.com",
  "password": "Password123"
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Login Successfully!",
  "user": {
    "_id": "665f1c2a2c7a9d0a12345678",
    "email": "khushi@example.com"
  },
  "token": "<JWT_TOKEN>"
}
```

### POST `/api/auth/logout`

Success `200`:

```json
{
  "success": true,
  "message": "Logged Out"
}
```

### POST `/api/auth/forgot-password`

```json
{
  "email": "khushi@example.com"
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Reset email sent"
}
```

### POST `/api/auth/reset-password/:token`

```json
{
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Password Reset Successful",
  "token": "<JWT_TOKEN>"
}
```

### GET `/api/auth/me`

Success `200`:

```json
{
  "success": true,
  "user": {
    "_id": "665f1c2a2c7a9d0a12345678",
    "fullName": "Khushi Kumari",
    "email": "khushi@example.com",
    "credits": 5
  }
}
```

## Interview

### POST `/api/interviews`

```json
{
  "role": "Frontend Engineer",
  "company": "Google",
  "difficulty": "medium",
  "techStack": ["React", "JavaScript", "System Design"],
  "questions": [
    {
      "question": "Explain React reconciliation.",
      "category": "technical",
      "difficulty": "medium"
    }
  ],
  "interviewType": "ai",
  "status": "scheduled"
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Interview created successfully",
  "interview": {
    "_id": "665f1d742c7a9d0a12345679",
    "user": "665f1c2a2c7a9d0a12345678",
    "role": "Frontend Engineer",
    "status": "scheduled"
  }
}
```

### GET `/api/interviews`

Optional filters:

```txt
?status=completed&difficulty=medium&interviewType=ai&page=1&limit=10&sort=-createdAt
```

Success `200`:

```json
{
  "success": true,
  "message": "Interviews fetched successfully",
  "interviews": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### GET `/api/interviews/:id`

Success `200`:

```json
{
  "success": true,
  "message": "Interview fetched successfully",
  "interview": {
    "_id": "665f1d742c7a9d0a12345679",
    "role": "Frontend Engineer"
  }
}
```

### POST `/api/v1/interviews/:id/generate-questions`

Generates 5 AI interview questions for an existing interview owned by the authenticated user. The request body can be empty because the AI prompt is built from the saved interview fields: `role`, `company`, `difficulty`, `techStack`, and `interviewType`.

```json
{}
```

Success `200`:

```json
{
  "success": true,
  "message": "Interview questions generated successfully",
  "interview": {
    "id": "665f1d742c7a9d0a12345679",
    "role": "Frontend Engineer",
    "company": "Google",
    "difficulty": "medium",
    "techStack": ["React", "JavaScript", "System Design"],
    "interviewType": "technical",
    "questions": [
      {
        "question": "Explain how React reconciliation works and how keys affect rendering performance.",
        "category": "technical",
        "expectedAnswer": "A strong answer should explain virtual DOM comparison, diffing, and why stable keys help React match list items efficiently.",
        "difficulty": "medium"
      },
      {
        "question": "How would you structure state management for a complex frontend interview dashboard?",
        "category": "system-design",
        "expectedAnswer": "A strong answer should discuss local state, server state, caching, optimistic updates, separation of concerns, and tradeoffs between Context, Redux, or query libraries.",
        "difficulty": "medium"
      },
      {
        "question": "Describe how you would optimize a React page with slow initial rendering.",
        "category": "technical",
        "expectedAnswer": "A strong answer should mention profiling, memoization, code splitting, virtualization, asset optimization, and avoiding unnecessary re-renders.",
        "difficulty": "medium"
      },
      {
        "question": "Write an approach for debouncing a search input and handling stale API responses.",
        "category": "coding",
        "expectedAnswer": "A strong answer should include debounce timing, request cancellation or response ordering, loading states, error handling, and accessibility considerations.",
        "difficulty": "medium"
      },
      {
        "question": "How would you make a frontend application resilient when the backend intermittently fails?",
        "category": "technical",
        "expectedAnswer": "A strong answer should cover retries, timeout handling, graceful fallbacks, user messaging, cached data, observability, and avoiding duplicate mutations.",
        "difficulty": "medium"
      }
    ],
    "aiMetadata": {
      "provider": "gemini",
      "model": "gemini-flash-latest",
      "generatedAt": "2026-05-25T10:30:00.000Z"
    }
  }
}
```

AI configuration error `500`:

```json
{
  "success": false,
  "message": "GEMINI_API_KEY is not configured"
}
```

Malformed AI response `502`:

```json
{
  "success": false,
  "message": "AI response JSON was malformed"
}
```

### POST `/api/v1/interviews/:id/answers`

Submits a candidate answer for one generated question, evaluates it with Gemini, saves the per-question evaluation, and updates the overall interview score. The `:id` value must be the interview `_id`, not the user `_id`.

```json
{
  "questionIndex": 0,
  "answer": "React reconciliation compares the previous and next component trees, finds the minimal set of DOM updates, and uses keys to keep list item identity stable across renders."
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Interview answer evaluated successfully",
  "answer": {
    "questionIndex": 0,
    "question": "Explain how React reconciliation works and how keys affect rendering performance.",
    "answer": "React reconciliation compares the previous and next component trees, finds the minimal set of DOM updates, and uses keys to keep list item identity stable across renders.",
    "score": 84,
    "feedback": "Good explanation of reconciliation and key stability. To improve, mention how unstable keys can cause unnecessary remounts and state loss.",
    "rubric": {
      "correctness": 88,
      "communication": 86,
      "depth": 78,
      "tradeoffs": 74,
      "codeQuality": 82
    },
    "answeredAt": "2026-05-25T10:35:00.000Z",
    "evaluatedAt": "2026-05-25T10:35:04.000Z"
  },
  "interview": {
    "id": "665f1d742c7a9d0a12345679",
    "score": 84,
    "status": "in-progress"
  }
}
```

Validation error `400`:

```json
{
  "success": false,
  "message": "questionIndex must be a non-negative integer"
}
```

Validation error `400`:

```json
{
  "success": false,
  "message": "Answer is required"
}
```

Question not found `404`:

```json
{
  "success": false,
  "message": "Question index not found"
}
```

Malformed AI response `502`:

```json
{
  "success": false,
  "message": "Malformed AI response: rubric object is required"
}
```

### PUT `/api/interviews/:id`

```json
{
  "status": "completed",
  "score": 86,
  "duration": 42,
  "feedback": {
    "summary": "Strong fundamentals with room to improve system tradeoffs.",
    "strengths": ["React concepts", "Communication"],
    "improvements": ["Caching strategy"]
  }
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Interview updated successfully",
  "interview": {
    "_id": "665f1d742c7a9d0a12345679",
    "status": "completed",
    "score": 86
  }
}
```

### DELETE `/api/interviews/:id`

Success `200`:

```json
{
  "success": true,
  "message": "Interview deleted successfully"
}
```

## Resume Analysis

### POST `/api/resume-analysis`

```json
{
  "resumeUrl": "https://cdn.example.com/resumes/khushi.pdf",
  "extractedSkills": ["React", "Node.js", "MongoDB"],
  "missingSkills": ["System Design"],
  "ATSScore": 78,
  "feedback": {
    "summary": "Good technical profile with measurable impact missing.",
    "sections": ["Experience", "Projects"],
    "keywordMatches": ["React", "Node.js"]
  },
  "suggestedImprovements": ["Add metrics to project bullet points"]
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Resume analysis created successfully",
  "resumeAnalysis": {
    "_id": "665f1f122c7a9d0a12345681",
    "ATSScore": 78
  }
}
```

### GET `/api/resume-analysis`

```txt
?minATSScore=70&page=1&limit=10
```

Success `200`:

```json
{
  "success": true,
  "message": "Resume analyses fetched successfully",
  "resumeAnalyses": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### GET `/api/resume-analysis/:id`

Success `200`:

```json
{
  "success": true,
  "message": "Resume analysis fetched successfully",
  "resumeAnalysis": {
    "_id": "665f1f122c7a9d0a12345681",
    "resumeUrl": "https://cdn.example.com/resumes/khushi.pdf"
  }
}
```

### DELETE `/api/resume-analysis/:id`

Success `200`:

```json
{
  "success": true,
  "message": "Resume analysis deleted successfully"
}
```

## Coding Submission

### POST `/api/coding-submissions`

```json
{
  "problemTitle": "Two Sum",
  "language": "javascript",
  "code": "function twoSum(nums, target) { return []; }",
  "verdict": "accepted",
  "runtime": 52,
  "memory": 42000,
  "passedTestCases": 25,
  "totalTestCases": 25
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Coding submission created successfully",
  "submission": {
    "_id": "665f1f872c7a9d0a12345682",
    "problemTitle": "Two Sum",
    "verdict": "accepted"
  }
}
```

### GET `/api/coding-submissions`

```txt
?verdict=accepted&language=javascript&page=1&limit=10
```

Success `200`:

```json
{
  "success": true,
  "message": "Coding submissions fetched successfully",
  "submissions": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### GET `/api/coding-submissions/:id`

Success `200`:

```json
{
  "success": true,
  "message": "Coding submission fetched successfully",
  "submission": {
    "_id": "665f1f872c7a9d0a12345682",
    "language": "javascript"
  }
}
```

## Coding Arena Problem Management

### GET `/api/v1/coding-arena/problems`

Query params: `page`, `limit`, `difficulty`, `search`

Success `200`:

```json
{
  "success": true,
  "message": "Problems fetched successfully",
  "problems": [
    {
      "_id": "665f1f872c7a9d0a12345690",
      "title": "Two Sum",
      "slug": "two-sum",
      "difficulty": "easy",
      "description": "Find two numbers that add up to target.",
      "examples": ["Input: [2,7,11,15], target=9"],
      "constraints": ["2 <= nums.length <= 10^4"],
      "starterCode": { "javascript": "function twoSum(nums, target) { }" },
      "visibleTestCases": [{ "input": "[2,7,11,15],9", "output": "[0,1]" }],
      "hiddenTestCases": []
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### GET `/api/v1/coding-arena/problems/:id`

Success `200`:

```json
{
  "success": true,
  "message": "Problem fetched successfully",
  "problem": {
    "_id": "665f1f872c7a9d0a12345690",
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "easy",
    "description": "Find two numbers that add up to target.",
    "examples": ["Input: [2,7,11,15], target=9"],
    "constraints": ["2 <= nums.length <= 10^4"],
    "starterCode": { "javascript": "function twoSum(nums, target) { }" },
    "visibleTestCases": [{ "input": "[2,7,11,15],9", "output": "[0,1]" }],
    "hiddenTestCases": []
  }
}
```

### POST `/api/v1/coding-arena/problems`

Auth required: Bearer token with `admin` role.

```json
{
  "title": "Two Sum",
  "slug": "two-sum",
  "difficulty": "easy",
  "description": "Find two numbers that add up to target.",
  "examples": ["Input: [2,7,11,15], target=9"],
  "constraints": ["2 <= nums.length <= 10^4"],
  "starterCode": {
    "javascript": "function twoSum(nums, target) { }",
    "python": "def two_sum(nums, target):\n    pass"
  },
  "visibleTestCases": [{ "input": "[2,7,11,15],9", "output": "[0,1]" }],
  "hiddenTestCases": []
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Problem created successfully",
  "problem": {
    "_id": "665f1f872c7a9d0a12345690",
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "easy"
  }
}
```

### PUT `/api/v1/coding-arena/problems/:id`

Auth required: Bearer token with `admin` role.

```json
{
  "title": "Two Sum Updated",
  "slug": "two-sum",
  "difficulty": "easy",
  "description": "Updated description.",
  "examples": ["Input: [2,7,11,15], target=9"],
  "constraints": ["2 <= nums.length <= 10^4"],
  "starterCode": {
    "javascript": "function twoSum(nums, target) { }"
  },
  "visibleTestCases": [{ "input": "[2,7,11,15],9", "output": "[0,1]" }],
  "hiddenTestCases": []
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Problem updated successfully",
  "problem": {
    "_id": "665f1f872c7a9d0a12345690",
    "title": "Two Sum Updated",
    "slug": "two-sum",
    "difficulty": "easy"
  }
}
```

### DELETE `/api/v1/coding-arena/problems/:id`

Auth required: Bearer token with `admin` role.

Success `200`:

```json
{
  "success": true,
  "message": "Problem deleted successfully"
}
```

## Analytics

### GET `/api/analytics/dashboard`

Success `200`:

```json
{
  "success": true,
  "message": "Analytics fetched successfully",
  "analytics": {
    "totalInterviews": 4,
    "totalCodingProblems": 12,
    "averageScore": 82,
    "streak": 3,
    "activityLogs": []
  }
}
```

### PUT `/api/analytics/update`

```json
{
  "totalInterviews": 5,
  "totalCodingProblems": 13,
  "averageScore": 84,
  "streak": 4,
  "activityLog": {
    "type": "interview",
    "title": "Completed AI interview",
    "description": "Frontend Engineer round scored 86",
    "metadata": {
      "score": 86
    }
  }
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Analytics updated successfully",
  "analytics": {
    "totalInterviews": 5,
    "averageScore": 84
  }
}
```

## Payment

### POST `/api/payments/create`

```json
{
  "paymentId": "pay_29ABcxyz",
  "amount": 499,
  "currency": "INR",
  "status": "pending",
  "paymentMethod": "razorpay"
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Payment created successfully",
  "payment": {
    "_id": "665f20322c7a9d0a12345683",
    "paymentId": "pay_29ABcxyz",
    "amount": 499,
    "status": "pending"
  }
}
```

### POST `/api/payments/verify`

```json
{
  "id": "665f20322c7a9d0a12345683",
  "status": "completed"
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "payment": {
    "_id": "665f20322c7a9d0a12345683",
    "status": "completed"
  }
}
```

### GET `/api/payments/history`

```txt
?status=completed&page=1&limit=10
```

Success `200`:

```json
{
  "success": true,
  "message": "Payment history fetched successfully",
  "payments": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

## Credit Usage

### POST `/api/credit-usage/consume`

```json
{
  "featureUsed": "ai-interview",
  "creditsConsumed": 1
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Credits consumed successfully",
  "creditUsage": {
    "_id": "665f20aa2c7a9d0a12345684",
    "featureUsed": "ai-interview",
    "creditsConsumed": 1,
    "remainingCredits": 4
  }
}
```

### GET `/api/credit-usage/history`

```txt
?featureUsed=ai-interview&page=1&limit=10
```

Success `200`:

```json
{
  "success": true,
  "message": "Credit history fetched successfully",
  "creditUsage": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

## Useful Error Examples

Unauthorized `401`:

```json
{
  "success": false,
  "message": "Unauthorized: No token provided!"
}
```

Validation error `400`:

```json
{
  "success": false,
  "message": "Missing required fields: role"
}
```

Not found `404`:

```json
{
  "success": false,
  "message": "Interview not found"
}
```
