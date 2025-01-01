import express from "express";
import { redirectUrl, shortUrl } from "../Controllers/urlController.js";
import { urlAnalytics } from "../Controllers/urlAnalyticsController.js";

const router = express.Router();

// Create Short URL API
router.post('/shorten', shortUrl);

// Redirect Short URL API
router.get('/shorten/:alias', redirectUrl);

// URL Analytics
router.get('/analytics/:alias', urlAnalytics);

export default router;