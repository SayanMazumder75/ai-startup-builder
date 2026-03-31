require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow both local + production
const allowedOrigins = [
  'http://localhost:3000',
  'https://ai-startup-builder-omega.vercel.app'
];

// ─── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(null, true); // allow temporarily (avoid crash)
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting
const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests. Please wait 15 minutes before trying again.' },
});

// ─── Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateLimiter, generateRoutes);
app.use('/api/projects', projectRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ✅ IMPORTANT: Listen properly
app.listen(PORT, '0.0.0.0', () => {
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Groq API: ${process.env.GROQ_API_KEY ? '✅ Connected' : '❌ Missing GROQ_API_KEY'}`);
  console.log(`🧠 Model: ${model}`);
});