# 🚀 InterVueX — AI-Powered Interview Preparation & Career Readiness Platform

![MERN](https://img.shields.io/badge/MERN-Stack-green)

![React](https://img.shields.io/badge/Frontend-React-blue)

![Node.js](https://img.shields.io/badge/Backend-Node.js-brightgreen)

![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-black)

![Gemini AI](https://img.shields.io/badge/AI-Gemini-orange)

InterVueX is a full-stack SaaS-style platform designed to help students, interns, and job seekers improve their interview readiness through AI-powered mock interviews, resume analysis, coding assessments, real-time notifications, and performance analytics.

Built using the MERN stack, Gemini AI, Socket.IO, and cloud-based services, the platform focuses on delivering a scalable and personalized preparation experience while demonstrating production-grade software engineering practices.

---
## 🌐 Live Demo

**Frontend:** https://intervuex-ai.netlify.app

**Backend API:**https://intervuex-ai-powered-interview.onrender.com

> Experience AI-powered interviews, resume analysis, coding assessments, analytics, and career readiness tracking in one platform.

# 🎯 Problem Statement

Preparing for technical interviews often requires multiple disconnected tools for:

- Resume review

- Coding practice

- Interview preparation

- Progress tracking

InterVueX unifies these workflows into a single platform by providing:

- AI-powered interview simulations

- Resume quality and ATS analysis

- Coding assessments

- Career readiness evaluation

- Real-time notifications

- Secure authentication and account management

---

# ✨ Core Features

## 🔐 Authentication & Security

- JWT Authentication

- Secure Password Hashing using bcrypt

- Protected Routes

- Role-Based Access Control (RBAC)

- Email Verification Workflow

- Forgot Password Functionality

- Reset Password Functionality

- Secure Token-Based Authentication

- Email Validation Layer using ZeroBounce

---

## 📧 Email Service Infrastructure

Powered by Brevo Transactional Email Services.

### Supported Email Flows

- Welcome Emails

- Email Verification Emails

- Password Reset Emails

- Security Notifications

- User Engagement Emails

- Platform Updates

### Features

- HTML Email Templates

- Secure Verification Tokens

- Email Validation Before Registration

- Reliable Transactional Delivery

- Error Handling & Retry Logic

---

## 🔔 Real-Time Notification System

Built using Socket.IO and MongoDB Persistence.

### Features

- Real-Time Event Delivery

- Persistent Notification Storage

- Read / Unread Tracking

- User-Specific Notifications

- Admin Broadcast Notifications

- Notification History Management

---

## 🎤 AI Interview Module

Powered by Gemini AI.

### Features

- Dynamic Interview Question Generation

- AI-Powered Mock Interviews

- Performance Evaluation

- Communication Assessment

- Answer Quality Analysis

- AI Feedback Generation

- Personalized Improvement Suggestions

---

## 📄 Resume Analysis Module

### Features

- Resume Upload & Parsing

- ATS Compatibility Analysis

- Resume Quality Scoring

- Skill Gap Detection

- Recruiter Readiness Insights

- AI Improvement Recommendations

- Resume Optimization Suggestions

- ATS Score Calculation

- Keyword Match Analysis

- Skills Extraction

---

## 💻 Coding Assessment Platform

### Features

- Coding Challenges

- Multi-Language Support (C++, Java, JavaScript, Python)

- Test Case Validation

- Hidden Test Cases

- Submission Tracking

- Performance Monitoring

- Progress Analytics

---

## 📊 Analytics Dashboard

### Features

- Interview Performance Analytics

- Coding Performance Analytics

- Resume Improvement Metrics

- AI-Generated Insights

- Career Readiness Score

- Strength Analysis

- Weakness Detection

- Personalized Improvement Guide

- Learning Path Recommendations

- Progress Tracking

- Learning Trend Visualization

---

## 💳 Credits & Payments

InterVueX uses a credit-based model for premium AI and platform features.

### Credit Usage

- Consume credits per feature usage (e.g., AI interview)

- Track remaining credits and usage history

- Credit history stored in MongoDB

### Payments

- Razorpay integration for credit packs
- Create payment order, verify payment signature
- Credit deposit on successful verification
- Payment history & status stored in MongoDB

---

## 👤 User Profile Management

- Profile Customization

- Career Goal Tracking

- Learning History

- Activity Tracking

- Progress Monitoring

---

## 🛡️ Admin Dashboard

### Features

- User Management

- Coding Problem Management

- Analytics Monitoring

- Notification Broadcasting

- Platform Administration

---

# 🏗️ System Architecture

```text

┌──────────────────────────────┐

│         React Client         │

└──────────────┬───────────────┘

               │

               ▼

┌──────────────────────────────┐

│       Express API Layer      │

└──────┬───────┬───────┬───────┘

       │       │       │

       ▼       ▼       ▼

 Authentication  AI Services  Notification Service

       │             │               │

       ▼             ▼               ▼

 JWT Auth     Gemini AI      Socket.IO Server

 Email Verify Resume AI      Notification Engine

 Password Reset Interview AI MongoDB Persistence

       │

       ▼

┌──────────────────────────────┐

│          MongoDB             │

└──────────────────────────────┘

```

---

# ⚙️ Technology Stack

## Frontend

- React.js

- Tailwind CSS

- React Router

- Axios

## Backend

- Node.js

- Express.js

- JWT

- bcrypt

- Socket.IO

- Express Middleware

## Database

- MongoDB

- Mongoose

## AI Services

- Gemini AI

## Email Services

- Brevo

- ZeroBounce

## Media Storage

- Cloudinary

---

# 🗂️ Project Structure

```bash

InterVueX

│

├── client

│   ├── src

│   │   ├── components

│   │   ├── pages

│   │   ├── hooks

│   │   ├── services

│   │   ├── context

│   │   └── utils

│

├── server

│   ├── src

│   │   ├── config

│   │   ├── controllers

│   │   ├── middleware

│   │   ├── models

│   │   ├── routes

│   │   ├── services

│   │   ├── sockets

│   │   ├── utils

│   │   └── jobs

│

├── README.md

└── package.json

```

---

# 🔄 Application Workflow

## User Flow

1\. Register Account

2\. Email Verification

3\. Login

4\. Complete Profile

5\. Upload Resume

6\. Analyze Resume

7\. Attend AI Interview

8\. Solve Coding Problems

9\. Receive Notifications

10\. View Analytics Dashboard

---

## Admin Flow

1\. Login to Dashboard

2\. Manage Users

3\. Create Coding Problems

4\. Broadcast Notifications

5\. Monitor Analytics

---

# 🔒 Security Features

- JWT Authentication

- Password Hashing with bcrypt

- Secure Cookie Handling

- Token-Based Email Verification

- Password Reset Tokens

- Protected API Routes

- Role-Based Authorization

- Email Validation Layer

- Input Validation & Sanitization

---

# 📈 Analytics Engine

InterVueX combines data from:

- AI Interview Sessions

- Resume Analysis Reports

- Coding Submissions

- User Activity Logs

To generate:

- Personalized Recommendations

- Improvement Suggestions

- Progress Trends

- Performance Reports

---

# 📧 Email Service Architecture

```text

User Registration

       │

       ▼

Email Validation (ZeroBounce)

       │

       ▼

Generate Verification Token

       │

       ▼

Brevo Email Service

       │

       ▼

Verification Email Delivery

       │

       ▼

Account Activation

```

---

# 🔔 Notification Architecture

```text

System Event

      │

      ▼

Notification Service

      │

      ▼

Store in MongoDB

      │

      ▼

Socket.IO Event

      │

      ▼

Connected User

```

---

# 🚀 Installation Guide

## Clone Repository

```bash

git clone https://github.com/your-username/intervuex.git

cd intervuex

```

## Install Client

```bash

cd client

npm install

npm run dev

```

## Install Server

```bash

cd server

npm install

npm run dev

```

---

# 🔧 Environment Variables

## Client

```env

VITE_API_BASE_URL=http://localhost:5000

```

## Server

```env

NODE_ENV=development

PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key

BREVO_API_KEY=your_brevo_api_key

BREVO_SENDER_EMAIL=your_sender_email

ZEROBOUNCE_API_KEY=your_zerobounce_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_key

CLOUDINARY_API_SECRET=your_cloudinary_secret

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_secret

```

---

# 🌍 Deployment

## Frontend

- Vercel

- Netlify

## Backend

- Render

- Railway

- VPS

## Database

- MongoDB Atlas

---

# 📚 API Endpoints

Postman-ready base URL (local):

- `http://localhost:4000`

Full endpoint list:

- `server/API_ENDPOINTS.md`

Protected endpoints require:

- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

AI question generation requires:

- `GEMINI_API_KEY` configured on the server

---

# 🏗️ Scalability Roadmap

Future enhancements planned for production-scale deployment:

### Performance

- Redis Caching

- Database Indexing

- Aggregation Optimization

### Background Processing

- BullMQ

- Job Queues

- Email Workers

- Analytics Workers

### Infrastructure

- Docker

- Kubernetes

- NGINX

- CI/CD Pipelines

### Architecture

- Microservices

- Event-Driven Architecture

- Distributed Notification Service

- AI Worker Services

---

# 💡 Engineering Highlights

- Modular Backend Architecture

- Service-Oriented Design

- RESTful API Design

- Real-Time Communication

- Persistent Notification System

- Secure Authentication Workflow

- AI Integration Layer

- Cloud Storage Integration

- Analytics Aggregation Engine

---

# 📸 Screenshots

Add screenshots here:

- Landing Page

- Dashboard

- AI Interview

- Resume Analysis

- Coding Assessment

- Admin Dashboard

---

# 👩‍💻 Author

**Shraddha Kumari**  
*Electrical Engineering Student | Full Stack Developer | Competitive Programmer*

- **GitHub:** [github.com/shraddha-kumari](https://github.com/shraddhaKodes) <!-- Update with your actual username -->
- **LinkedIn:** [linkedin.com/in/shraddha-kumari](https://www.linkedin.com/in/shraddhakodes) <!-- Update with your actual username -->

### Skills

- C++

- JavaScript

- React.js

- Node.js

- Express.js

- MongoDB

- AI Integration

- System Design

# © Copyright & Usage

Copyright © 2026 Shraddha Kumari. All Rights Reserved.

This repository is published for portfolio, educational, and demonstration purposes only.

Unauthorized copying, redistribution, commercial use, or reproduction of substantial portions of this codebase is prohibited without prior written permission from the author.


## 🚀 InterVueX --- Your AI-Powered Career Growth Platform
