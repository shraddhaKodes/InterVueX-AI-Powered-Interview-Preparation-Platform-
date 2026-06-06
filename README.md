# InterVueX — AI-Powered Interview Preparation Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20-43853D?logo=node.js)](#)
[![Express](https://img.shields.io/badge/Express.js-4-000000?logo=express)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](#)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=json-web-token)](#)
[![AI](https://img.shields.io/badge/AI-Gemini%2FOpenAI-F97316?logo=openai)](#)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwind-css)](#)

> Build your interview edge with AI mock rounds, coding assessments, resume analysis, and performance analytics — all in one place.

---

## 🚀 Project Banner / Headline

**InterVueX** helps candidates prepare like top engineers: generate tailored AI interviews, practice coding with online execution, analyze resume skill gaps, and track progress over time with actionable analytics.

---

## 📌 Overview

InterVueX is an AI-powered interview preparation platform built for real-world outcomes: better clarity, better coding practice, and measurable growth.

Core modules include:

- User authentication & authorization (JWT)
- AI mock interviews & evaluation (Gemini/OpenAI)
- Coding Arena with online code execution
- Resume analyzer + skill-gap detection
- Unified dashboard with progress tracking and analytics
- Interview & coding submission history
- Leaderboards / progress metrics

---

## ✨ Features (FAANG-style, outcome driven)

- 🔐 **Authentication & Authorization**: secure JWT-based access control
- 🧠 **AI Mock Interviews**: generate role-based technical questions and evaluate answers
- 🧾 **Coding Assessments**: problem solving with online execution provider
- 🕹️ **Coding Arena**: visible + hidden test case evaluation with verdicts
- 📄 **Resume Analysis**: extract skills, compute ATS score, generate feedback
- 🎯 **Skill Gap Detection**: identify missing competencies and prioritize improvements
- 📊 **Interview Performance Analytics**: rubric-based scoring and trends
- 🗂️ **Dashboard Tracking**: unified progress across interviews and coding
- 👤 **Profile Management**: manage user preferences and account details
- 📨 **Password Reset via Email**: secure reset flow with email notifications
- 🧠 **Interview History**: revisit past rounds and evaluations
- 💻 **Submission History**: track coding attempts and outcomes
- 🏆 **Leaderboards & Metrics**: progress-based rankings and insights

---

## 🧩 System Architecture

### High-level flow

1. **Frontend (React + Tailwind)** collects user inputs (interviews, coding, resumes).
2. **Backend (Node.js + Express)** handles:
   - authentication (JWT)
   - routing + validation
   - AI evaluation/generation (Gemini/OpenAI)
   - resume parsing and analysis
   - coding execution orchestration
   - analytics + persistence in MongoDB
3. **MongoDB Atlas** stores interviews, evaluations, resume analyses, submissions, and user data.
4. **Cloudinary** can be used for resume/assets storage.
5. **Sockets/Events (if enabled)** support real-time coding/interview UI updates.

### Component diagram (text)

- `Client (React)`
  - Auth pages, Dashboard, Coding Arena UI
- `Server (Express)`
  - `authRoutes`, `interviewRoutes`, `codingArenaRoutes`, `resumeAnalysisRoutes`, `analyticsRoutes`
  - services: AI, execution provider, resume analysis, analytics
- `MongoDB Atlas`
  - user, interviews, mock interviews, submissions, analytics schemas

---

## 🛠️ Tech Stack

| Category         | Tech                                 |
| ---------------- | ------------------------------------ |
| Frontend         | React.js, Tailwind CSS               |
| Backend          | Node.js, Express.js                  |
| Database         | MongoDB (MongoDB Atlas)              |
| Authentication   | JWT (access tokens)                  |
| AI Services      | Gemini / OpenAI APIs                 |
| Media            | Cloudinary                           |
| Email            | Nodemailer                           |
| Coding Execution | Online compiler provider (API-based) |

---

## 📁 Folder Structure (Monorepo)

```txt
IntervueX/
  client/
    src/
    public/
    package.json
  server/
    src/
      controllers/
      routes/
      services/
      models/
      middlewares/
    uploads/
    package.json
  .gitignore
  README.md
```

---

## 🔧 Installation & Setup

### 1) Clone

```bash
git clone <your-repo-url>
cd IntervueX
```

### 2) Client (React)

```bash
cd client
npm install
npm run dev
```

### 3) Server (Express)

```bash
cd server
npm install
npm run dev
```

> Ensure both client and server are running. Configure `VITE_API_BASE_URL` (or equivalent) on the client to point to your backend.

---

## ⚙️ Environment Variables

Create environment files as needed.

### Client environment (example)

Create `client/.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

### Server environment (example)

Create `server/.env`:

```bash
NODE_ENV=development
PORT=4000

# MongoDB
MONGO_URI=<your_mongodb_atlas_connection_string>

# JWT
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d

# Email (Password reset)
SMTP_HOST=<smtp_host>
SMTP_PORT=587
SMTP_USER=<smtp_user>
SMTP_PASS=<smtp_pass>
EMAIL_FROM=<from_email>

# Cloudinary (if uploading resumes/assets)
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>

# AI Provider (Gemini / OpenAI)
GEMINI_API_KEY=<your_gemini_api_key>
# or
OPENAI_API_KEY=<your_openai_api_key>

# Coding execution provider
ONLINE_COMPILER_BASE_URL=<provider_base_url>
ONLINE_COMPILER_API_KEY=<provider_api_key>
```

---

## 🌐 API Endpoints Overview

Primary documentation:

- `server/API_ENDPOINTS.md`

API is broadly organized into:

- **Auth**: register/login/logout/me + password reset
- **Interviews**: create interview, generate AI questions, evaluate answers
- **Mock Interviews**: mock question rounds and scoring
- **Resume Analyzer**: extract skills, compute ATS score, generate feedback
- **Coding Submissions**: store/verdict submissions
- **Coding Arena**: problem CRUD + test execution
- **Analytics**: dashboard metrics and streaks
- **Payments & Credit Usage**: plan handling + credit consumption

---

## 🖼️ Screenshots

Add screenshots for portfolio/placement reviewers.

| Page            | Placeholder                                                           |
| --------------- | --------------------------------------------------------------------- |
| Landing / Hero  | ![Landing Screenshot](./docs/screenshots/landing.png)                 |
| Login / Signup  | ![Auth Screenshot](./docs/screenshots/auth.png)                       |
| Dashboard       | ![Dashboard Screenshot](./docs/screenshots/dashboard.png)             |
| AI Interview    | ![AI Interview Screenshot](./docs/screenshots/ai-interview.png)       |
| Coding Arena    | ![Coding Arena Screenshot](./docs/screenshots/coding-arena.png)       |
| Resume Analyzer | ![Resume Analyzer Screenshot](./docs/screenshots/resume-analyzer.png) |

> Place images under `docs/screenshots/`.

---

## 🚀 Deployment

### Deployments supported

- **Vercel** (Frontend)
- **Render** (Backend)
- **MongoDB Atlas** (Database)

#### 1) Vercel (Client)

1. Push your repo to GitHub.
2. Import the `client` project into Vercel.
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Configure environment variables:
   - `VITE_API_BASE_URL` → your Render backend URL

#### 2) Render (Server)

1. Create a Render Web Service for `server`.
2. Set the start command:
   - `npm run start` (or `npm run dev` only for staging)
3. Set environment variables (from the Server Environment Variables section).
4. Connect to MongoDB Atlas using `MONGO_URI`.

#### 3) Domain / HTTPS

- Ensure your client points to the correct backend base URL.
- If using JWT cookies or redirects, verify CORS and allowed origins.

---

## 🧠 Future Enhancements

- 🤝 **Real-time interview collaboration** (multi-user rooms / shared sessions)
- 🧾 **Export reports** (PDF resume/interview analytics)
- 🧠 **Advanced rubric tuning** per role/company
- 🗳️ **Community problem submissions + moderation**
- 💾 **Caching layer** for AI responses to reduce token usage
- 🔍 **Resume parsing improvements** using more robust parsing strategies
- 🏢 **Team dashboards** for internship / cohort tracking

---

## 🤝 Contributing

Contributions are welcome!

### Development workflow

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/<name>
   ```
3. Commit changes:
   ```bash
   git commit -m "feat: <description>"
   ```
4. Push to your fork and open a Pull Request.

### Code style

- Keep commits small and readable
- Add/Update documentation for new APIs/features

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 📫 Contact

- **Project Maintainer**: _Your Name_
- **Email**: *your.email@example.com*
- **GitHub**: *https://github.com/<your-username>*

---

## ✅ Badges (Portfolio-friendly)

React • Node.js • Express • MongoDB • JWT • AI (Gemini/OpenAI) • Tailwind CSS
