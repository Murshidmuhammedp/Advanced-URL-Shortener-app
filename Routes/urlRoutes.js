import express from "express";
import { redirectUrl, shortUrl } from "../Controllers/urlController.js";
import { urlAnalytics } from "../Controllers/urlAnalyticsController.js";
import { topicBasedAnalytics } from "../Controllers/topicBasedAnalyticController.js";
import { overallAnalytics } from "../Controllers/OverallAnalyticsController.js";
import { isAuthenticated } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Create Short URL API
router.post('/shorten/:userId', isAuthenticated, shortUrl);

// Redirect Short URL API
router.get('/shorten/:alias', redirectUrl);

// URL Analytics
router.get('/analytics/:alias', urlAnalytics);

// Topic-Based Analytics
router.get('/analytics/topic/:topic', topicBasedAnalytics);

// Overall Analytics API
router.get('/analytic/overall', overallAnalytics);


export default router;