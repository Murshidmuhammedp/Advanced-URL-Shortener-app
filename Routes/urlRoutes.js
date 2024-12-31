import express from "express";
import { redirectUrl, shortUrl } from "../Controllers/urlController.js";

const router = express.Router();

// Create Short URL API
router.post('/shorten', shortUrl);

// Redirect Short URL API
router.get('/shorten/:alias', redirectUrl);

export default router;