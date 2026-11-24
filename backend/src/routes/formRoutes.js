const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const submissionRoutes = require('./submissionRoutes');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { validateCreateForm, validateUpdateForm } = require('../validators/formValidator');

// Submissions nested router
router.use('/:formId/submissions', submissionRoutes);

// Form endpoints
router.post('/', requireAuth, validateCreateForm, formController.createForm);
router.get('/', optionalAuth, formController.listForms);
router.get('/:id', optionalAuth, formController.getForm);
router.put('/:id', requireAuth, validateUpdateForm, formController.updateForm);
router.delete('/:id', requireAuth, formController.deleteForm);

module.exports = router;
