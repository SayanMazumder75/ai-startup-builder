const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Shared in-memory store (in production, use a real database)
const projectsStore = new Map();

// GET all projects for user
router.get('/', authenticate, (req, res) => {
  const userProjects = projectsStore.get(req.user.id) || [];
  res.json({
    projects: userProjects.map(p => ({
      id: p.id,
      idea: p.idea,
      createdAt: p.createdAt,
      nameOptions: p.kit?.branding?.nameOptions?.slice(0, 2) || [],
    })),
  });
});

// GET single project
router.get('/:id', authenticate, (req, res) => {
  const userProjects = projectsStore.get(req.user.id) || [];
  const project = userProjects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
});

// DELETE project
router.delete('/:id', authenticate, (req, res) => {
  const userProjects = projectsStore.get(req.user.id) || [];
  const filtered = userProjects.filter(p => p.id !== req.params.id);
  projectsStore.set(req.user.id, filtered);
  res.json({ success: true });
});

// Export store so generate route can write to it
module.exports = router;
module.exports.projectsStore = projectsStore;
