import express from "express";
import { redirectUrl, shortUrl } from "../Controllers/urlController.js";
import { urlAnalytics } from "../Controllers/urlAnalyticsController.js";
import { topicBasedAnalytics } from "../Controllers/topicBasedAnalyticController.js";
import { overallAnalytics } from "../Controllers/OverallAnalyticsController.js";
import verifyToken from "../Middlewares/jwtMiddleware.js";

const router = express.Router();

// Create Short URL API
router.post('/shorten/:userId', verifyToken, shortUrl);

// Redirect Short URL API
router.get('/shorten/:alias', verifyToken, redirectUrl);

// URL Analytics
router.get('/analytics/:alias', verifyToken, urlAnalytics);

// Topic-Based Analytics
router.get('/analytics/topic/:topic', verifyToken, topicBasedAnalytics);

// Overall Analytics API
router.get('/analytic/overall', verifyToken, overallAnalytics);


export default router;