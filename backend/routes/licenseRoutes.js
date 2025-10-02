import express from 'express';
import {
  requestLicenseKey,
  validateLicenseKey,
  getLicenseKeyStatus,
  resendLicenseKey
} from '../controllers/licenseController.js';
import { validateLicenseRequest } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/request', validateLicenseRequest, requestLicenseKey);
router.post('/validate', validateLicenseKey);
router.get('/status', getLicenseKeyStatus);
router.post('/resend', validateLicenseRequest, resendLicenseKey);

export default router;