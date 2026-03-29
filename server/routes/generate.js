const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');
const { generateStartupKit } = require('../api/claude');

const router = express.Router();

// In-memory project store (replace with DB in production)
const projects = new Map();

router.post('/', authenticate, async (req, res) => {
  const { idea } = req.body;

  if (!idea || idea.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a startup idea (at least 10 characters)' });
  }
  if (idea.length > 500) {
    return res.status(400).json({ error: 'Idea too long. Please keep it under 500 characters.' });
  }

  console.log(`\n🧠 Generating startup kit for: "${idea}"`);
  console.log(`👤 User: ${req.user.email}`);

  try {
    const startTime = Date.now();
    const kitData = await generateStartupKit(idea);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    const project = {
      id: uuidv4(),
      userId: req.user.id,
      idea: idea.trim(),
      kit: kitData,
      createdAt: new Date().toISOString(),
    };

    // Store project
    if (!projects.has(req.user.id)) {
      projects.set(req.user.id, []);
    }
    projects.get(req.user.id).unshift(project);

    console.log(`✅ Generated in ${duration}s for project ${project.id}`);

    res.json({
      success: true,
      projectId: project.id,
      idea: project.idea,
      kit: kitData,
      generatedAt: project.createdAt,
      duration: parseFloat(duration),
    });
  } catch (err) {
    console.error('Generation error:', err.message);

    if (err.message?.includes('decommissioned')) {
      return res.status(500).json({ error: err.message });
    }
    if (err.message?.includes('JSON') || err.message?.includes('Unexpected token')) {
      return res.status(500).json({ error: 'AI returned invalid response. Please try again.' });
    }
    if (err.message?.includes('Invalid Groq API key') || err.message?.includes('401')) {
      return res.status(500).json({ error: 'Invalid Groq API key. Check GROQ_API_KEY in your .env file.' });
    }
    if (err.message?.includes('rate limit') || err.message?.includes('429')) {
      return res.status(503).json({ error: 'Groq rate limit hit. Please wait a moment and try again.' });
    }
    if (err.message?.includes('timed out')) {
      return res.status(503).json({ error: 'Request timed out. Please try again.' });
    }

    res.status(500).json({ error: 'Generation failed', message: err.message });
  }
});

// Export projects map so projects route can access it
router.projectsStore = projects;

module.exports = router;
