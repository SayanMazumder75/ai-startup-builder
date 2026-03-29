# ⚡ AI Startup Builder

> Generate a complete startup kit — landing page, business plan, branding & pitch deck — in under 60 seconds using Claude AI.

---

## 🚀 What It Does

Enter any startup idea and get:

| Output | What's Included |
|--------|----------------|
| 🌐 **Landing Page** | Hero, features, pricing, testimonials, FAQ — with copy-ready React + Tailwind code |
| 📋 **Business Plan** | Problem/solution, target audience, revenue model, milestones, risk analysis |
| 🎨 **Branding** | 4 name options, color palette (hex codes), logo concept, typography, brand voice |
| 📊 **Pitch Deck** | 10 investor-ready slides with speaker notes + investor FAQ |

---

## 🏗 Folder Structure

```
ai-startup-builder/
├── client/                    # React frontend (CRA)
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── LandingPageTab.js   # Landing page preview + code export
│       │   ├── BusinessPlanTab.js  # Full business plan UI
│       │   ├── BrandingTab.js      # Color palette, names, logo concept
│       │   └── PitchDeckTab.js     # Interactive slide viewer
│       ├── context/
│       │   └── AuthContext.js      # JWT auth state
│       ├── pages/
│       │   ├── AuthPage.js         # Login / Signup
│       │   ├── Dashboard.js        # Idea input + project history
│       │   └── ResultsPage.js      # Tabbed output viewer
│       ├── utils/
│       │   ├── api.js              # Fetch wrapper
│       │   └── export.js           # PDF/clipboard export
│       ├── App.js
│       ├── index.js
│       └── index.css              # Design system (CSS variables)
│
├── server/                    # Node.js + Express backend
│   ├── api/
│   │   └── claude.js              # Claude API integration + prompt engineering
│   ├── middleware/
│   │   └── auth.js                # JWT middleware
│   ├── routes/
│   │   ├── auth.js                # Signup / Login / Me
│   │   ├── generate.js            # POST /api/generate
│   │   └── projects.js            # GET/DELETE saved projects
│   └── index.js                   # Express server entry
│
├── .env.example               # Environment variables template
├── package.json               # Root scripts (concurrently)
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- npm 9+
- A Claude API key ([get one here](https://console.anthropic.com))

---

### Step 1 — Clone & Install

```bash
# Clone the repo
git clone https://github.com/yourname/ai-startup-builder.git
cd ai-startup-builder

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

---

### Step 2 — Configure Environment

```bash
# Copy the example env file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
CLAUDE_API_KEY=sk-ant-your-key-here
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=any-long-random-string-here
```

> ⚠️ **Never commit your `.env` file to git!**

---

### Step 3 — Run the App

```bash
# Start both frontend and backend together
npm run dev
```

Or start them separately:

```bash
# Terminal 1 — Backend (port 5000)
cd server && npm run dev

# Terminal 2 — Frontend (port 3000)
cd client && npm start
```

Open **http://localhost:3000** in your browser.

---

### Step 4 — Login

Use the demo account:
- **Email:** `demo@startup.ai`
- **Password:** `demo1234`

Or click **"Sign up free"** to create your own account.

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Get JWT token |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/generate` | ✅ | Generate startup kit |
| GET | `/api/projects` | ✅ | List saved projects |
| GET | `/api/projects/:id` | ✅ | Get single project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/health` | ❌ | Health check |

---

## 🧠 AI Prompt Engineering

The Claude prompt (`server/api/claude.js`) is engineered to:

1. **Single-shot JSON** — Returns all 4 sections in one structured API call
2. **Strict schema** — Forces a predictable JSON shape that the frontend can safely consume
3. **Idea-specific** — Every data point is tailored to the user's specific startup concept
4. **Production quality** — Uses `claude-opus-4-5` for maximum reasoning depth

The prompt generates:
- Realistic metrics (TAM, revenue projections)
- Compelling copy (hero headlines, taglines)  
- Specific brand hex codes
- Complete investor pitch content

---

## 💡 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS Variables (no Tailwind needed in CRA — code exports use Tailwind) |
| Backend | Node.js, Express |
| AI | Anthropic Claude API (`claude-opus-4-5`) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Storage | In-memory (replace with MongoDB/PostgreSQL for production) |
| Export | HTML file export (opens in browser, printable to PDF) |

---

## 🚀 Production Deployment

### Backend (Railway / Render / Fly.io)
```bash
cd server
# Set environment variables in your platform dashboard
# Deploy with: git push
```

### Frontend (Vercel / Netlify)
```bash
cd client
npm run build
# Deploy the /build folder
# Set REACT_APP_API_URL to your backend URL
```

Update `client/src/utils/api.js` for production:
```js
const BASE = process.env.REACT_APP_API_URL || '/api';
```

---

## 🛠 Customization

### Switch to a real database
Replace the `Map()` stores in `server/routes/` with your preferred DB:
- **MongoDB**: Use mongoose + `User` and `Project` models
- **PostgreSQL**: Use prisma or pg

### Add Firebase Auth
1. Install `firebase` in client
2. Replace mock login in `AuthContext.js` with Firebase `signInWithEmailAndPassword`
3. Send Firebase ID token to backend for verification

### Change AI model
In `server/api/claude.js`:
```js
model: 'claude-opus-4-5',  // Change to claude-sonnet or haiku for faster/cheaper results
```

---

## 📦 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both servers (from root) |
| `npm run build` | Build React app for production |
| `cd server && npm start` | Start backend in production mode |
| `cd server && npm run dev` | Start backend with nodemon |
| `cd client && npm start` | Start React dev server |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT — free to use, modify and deploy.

---

Built with ❤️ using [Claude](https://anthropic.com) by Anthropic.
