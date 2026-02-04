
# AI Learning Planner 🚀

An AI-powered personalized learning platform that creates **adaptive learning roadmaps** using LLMs (Gemini / Ollama) based on user goals, experience, and available time.

---

## ✨ Features

- 🔐 Authentication (Register / Login / Logout)
- 🤖 AI-generated questionnaires (Gemini API / Local Ollama)
- 📚 Personalized weekly learning plans
- 🧭 Track progress (week completion)
- 👤 User profile management
- 🌍 Full-stack deployment on Vercel
- ⚙️ CI/CD with GitHub Actions
- 🧪 Automated backend testing (Jest)
- 🍪 Secure cookie-based auth (JWT)
- 🗃️ MongoDB persistence
- 🐳 Docker support for local setup
- 💻 Local AI support with Ollama (offline mode)

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router
- Vercel

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Google Gemini AI (cloud)
- Ollama (local AI)
- Serverless (Vercel)

### DevOps
- GitHub Actions (CI/CD)
- Vercel Deployments
- MongoDB Atlas
- Docker (local development)

---

## 📁 Project Structure

```

AI-Learning-Planner/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   │   ├── auth/       # Login/Register pages
│   │   │   ....            # Other Pages
│   │   │   .... 
│   │   ├── store/          # Redux tool kit
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.development
│   ├── .env.production
│   └── vite.config.js
│
├── server/
│   ├── controllers/        # Business logic
│   ├── routes/             # API routes
│   ├── models/             # Mongoose models
│   ├── middleware/         # Auth, error handling
│   ├── config/             # CORS, env configs
│   ├── db/                 # MongoDB connection
│   ├── tests/              # Jest tests
│   ├── app.js              # Express app
│   └── server.local.js            # Server entry
│
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
└── README.md

````

---

## ⚙️ Environment Variables

### Backend (server)

#### `.env.local`
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_learning_local
JWT_SECRET=dev_secret
CLIENT_URL=http://localhost:5173
GOOGLE_API_KEY=your_key
REDIS_URL=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
UPSTASH_REDIS_REST_URL=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
UPSTASH_REDIS_REST_TOKEN="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
````

---

#### `.env.production` (Vercel)

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai_learning
JWT_SECRET=prod_secret
CLIENT_URL=https://ailearningplan.vercel.app
GOOGLE_API_KEY=your_key
REDIS_URL=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
UPSTASH_REDIS_REST_URL=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
UPSTASH_REDIS_REST_TOKEN="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

```

---

### Frontend (client)

#### `.env.development`

```env
VITE_BACKEND_URL=http://localhost:5000
```

#### `.env.production`

```env
VITE_BACKEND_URL=https://ai-learning-planner.vercel.app
```

---

## 🚀 Running Locally

### 1️⃣ Clone repository

```bash
git clone https://github.com/SARVESHYOGI/AI-Learning-Planner.git
cd ai-learning-planner
```

---

### 2️⃣ Start Backend

```bash
cd server
npm install
npm run dev
```

Runs on:

```
http://localhost:5000
```

---

### 3️⃣ Start Frontend

```bash
cd client
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## 🐳 Run with Docker (Optional)

```bash
docker compose up --build
```

---

## 🤖 Local AI Setup (Ollama)

If you want to use AI **locally (offline, no cloud API, no cost)**, you can run the project with **Ollama**.

👉 Follow the full step-by-step guide here:  
📄 **[Local AI Setup Guide](./localai.setup.md)**

This mode is useful if:
- You want offline AI
- You don’t want to use Gemini API
- You want full local control
- You are developing without internet

⚠️ No environment variable change is required.  
You only need to switch code in `generator()` function.

---

## 🧪 Running Tests

```bash
cd server
npm test
```

---

## 🔁 CI/CD Pipeline

Runs automatically on push to `main`.

**Pipeline Steps:**

1. Install dependencies
2. Run backend tests
3. Build frontend
4. Deploy to Vercel

---

## 🌍 Deployment URLs

### Frontend

```
https://ailearningplan.vercel.app
```

### Backend

```
https://ai-learning-planner.vercel.app
```

---

## ⏱️ Timeout Configuration

AI responses may take time (LLM generation).

Axios timeout:

```js
timeout: 180000
```

(3 minutes)

---

## 🔐 Authentication Flow

* JWT stored in httpOnly cookies
* Secure cookies in production
* SameSite=None for cross-domain
* Axios uses `withCredentials: true`

---

## 🧠 AI Flow

1. User selects topic
2. AI generates questionnaire
3. User submits answers
4. AI generates learning plan
5. Plan stored in MongoDB
6. User tracks weekly progress

---

## 📌 Future Scope

* 💳 Payment integration (Stripe / Razorpay)
* 📱 Mobile app
* 📊 Analytics dashboard
* 🔔 Notifications
* 🧠 AI model switching UI
* 🗂️ Plan sharing
* 🏷️ Tags & goals

---

## 📜 License (IMPORTANT)

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Sarvesh Yogi**
BE Computer Engineering, TSEC
Full Stack Developer | AI & Backend Enthusiast

---


## ⭐ Support

If you find this project useful, please ⭐ the repository.
PRs are welcome!


