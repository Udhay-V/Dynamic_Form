const express = require('express');
const router = express.Router({ mergeParams: true });
const submissionController = require('../controllers/submissionController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { submissionLimiter } = require('../middleware/rateLimiter');

// POST /api/forms/:formId/submissions - public submission (rate limited, optional auth for admin testing)
router.post('/', submissionLimiter, optionalAuth, submissionController.submitForm);

// GET /api/forms/:formId/submissions - admin list submissions (paginated)
router.get('/', requireAuth, submissionController.listSubmissions);

// GET /api/forms/:formId/submissions/:id - admin view single submission
router.get('/:id', requireAuth, submissionController.getSubmission);

// DELETE /api/forms/:formId/submissions/:id - admin delete submission
router.delete('/:id', requireAuth, submissionController.deleteSubmission);

module.exports = router;
