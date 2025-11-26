import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as templatesController from '../controllers/templatesController.js';

const router = express.Router();

// Get all available templates
router.get('/', templatesController.getAllTemplates);

// Get a specific template by ID
router.get('/:templateId', templatesController.getTemplateById);

// Generate template data (creates spreadsheet data from template)
// Authentication is optional - templates are public resources
router.post('/:templateId/generate', templatesController.generateTemplate);

// Create custom template (admin only - future feature)
// router.post('/custom', authenticateToken, templatesController.createCustomTemplate);

export default router;
