import express from "express";
import { redirectUrl, shortUrl } from "../Controllers/urlController.js";
import { urlAnalytics } from "../Controllers/urlAnalyticsController.js";
import { topicBasedAnalytics } from "../Controllers/topicBasedAnalyticController.js";

const router = express.Router();

// Create Short URL API
router.post('/shorten', shortUrl);

// Redirect Short URL API
router.get('/shorten/:alias', redirectUrl);

// URL Analytics
router.get('/analytics/:alias', urlAnalytics);

// Get Topic-Based Analytics
router.get('/analytics/topic/:topic', topicBasedAnalytics);

export default router;