# Advanced URL Shortener App

## Overview
An advanced URL Shortener application with comprehensive analytics, custom aliases, and rate limiting. This project integrates Redis, Docker, and Swagger for scalability, performance, and documentation.

## Features
- **Shorten URLs** with custom aliases.
- **Analytics Dashboard** for URL performance.
- **Topic-based Analytics** to group URLs.
- **Overall Analytics** to view system-wide trends.
- **Google Authentication** with OAuth 2.0.
- **JWT Authentication** for secure APIs.
- **Rate Limiting** to prevent abuse.
- **Swagger Documentation** for API testing.
- **Dockerized Setup** for containerized deployment.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Caching:** Redis
- **Authentication:** Passport.js (Google OAuth), JWT
- **Documentation:** Swagger
- **Containerization:** Docker

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd url-shortener
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```
PORT=5645
MONGO_URI=mongodb+srv://<username>:<password>@atlascluster.mongodb.net/url_shortener
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=<your_jwt_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
```

### 4. Start the Server
```bash
npm start
```
Server runs at: `http://localhost:5645`

### 5. Docker Setup
#### Build and Run the Docker Container
```bash
docker-compose up --build
```

### 6. Swagger API Documentation
Access Swagger documentation at:
```
http://localhost:5645/api-docs
```

## API Routes

### Authentication
- **Google OAuth Login:** `GET /google`
- **Google OAuth Callback:** `GET /google/callback`
- **Logout:** `GET /logout`

### URL Shortening
- **Create Short URL:** `POST /shorten/:userId`
- **Redirect URL:** `GET /shorten/:alias`

### Analytics
- **URL Analytics:** `GET /analytics/:alias`
- **Topic-Based Analytics:** `GET /analytics/topic/:topic`
- **Overall Analytics:** `GET /analytic/overall`

## Deployed Link
Access the live project here:
(http://13.60.181.76)

## Contributions
Feel free to fork the repository and create pull requests. Feedback is welcome!

## License
This project is licensed under the MIT License.

