# Portfolio Platform

A dynamic, multi-tenant portfolio platform built with modern technologies.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: Go + Gin
- **Database**: PostgreSQL
- **Containerization**: Docker + Docker Compose

## Features

- 🎨 Modern, responsive design with glassmorphism effects
- 🌍 Bilingual support (English/French)
- 👤 User authentication and role-based access
- 📊 Dashboard for portfolio management
- 💼 Sections: Skills, Projects, Experience, Education, Testimonials
- 📧 Contact form functionality
- 🔐 Secure API with JWT authentication

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local frontend development)
- Go 1.21+ (for local backend development)

### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. Start all services:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Database: localhost:5432

### Local Development

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
cp .env.example .env
go mod tidy
go run ./cmd/server
```

## Project Structure

```
Portfolio/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── layout/      # Header, Footer, Layout
│   │   │   ├── sections/    # Hero, Skills, Projects, etc.
│   │   │   └── ui/          # Button, Card, etc.
│   │   ├── pages/           # Page components
│   │   ├── i18n/            # Internationalization
│   │   └── styles/          # Global CSS
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # Go backend
│   ├── cmd/server/          # Main entry point
│   ├── internal/
│   │   ├── config/          # Configuration
│   │   ├── handler/         # HTTP handlers
│   │   ├── model/           # Data models
│   │   ├── repository/      # Database layer
│   │   └── middleware/      # HTTP middleware
│   ├── Dockerfile
│   └── go.mod
│
├── database/                 # Database files
│   ├── migrations/          # SQL migrations
│   └── init.sql             # Initialization script
│
├── docker-compose.yml        # Development compose
├── docker-compose.prod.yml   # Production compose
└── README.md
```

## API Endpoints

### Health
- `GET /api/health` - Health check

### Users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Portfolios
- `GET /api/portfolios` - List all portfolios
- `GET /api/portfolios/:username` - Get portfolio by username

### Skills
- `GET /api/skills/user/:userId` - Get user's skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Projects
- `GET /api/projects/user/:userId` - Get user's projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Experience
- `GET /api/experience/user/:userId` - Get user's experience
- `POST /api/experience` - Create experience
- `PUT /api/experience/:id` - Update experience
- `DELETE /api/experience/:id` - Delete experience

### Education
- `GET /api/education/user/:userId` - Get user's education
- `POST /api/education` - Create education
- `PUT /api/education/:id` - Update education
- `DELETE /api/education/:id` - Delete education

### Testimonials
- `GET /api/testimonials/user/:userId` - Get user's testimonials
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial
- `PUT /api/testimonials/:id/approve` - Approve testimonial

### Contact
- `POST /api/contact` - Send message
- `GET /api/contact/messages/:userId` - Get user's messages

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `ENVIRONMENT` | Environment mode | `development` |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key for contact form CAPTCHA | unset (CAPTCHA disabled) |
| `CONTACT_RATE_LIMIT_WINDOW_MINUTES` | Contact rate-limit rolling window in minutes | `10` |
| `CONTACT_RATE_LIMIT_MAX_PER_WINDOW` | Max contact submissions per IP in window | `3` |
| `CONTACT_RATE_LIMIT_MAX_PER_DAY` | Max contact submissions per IP per day | `20` |
| `CONTACT_MIN_SUBMIT_SECONDS` | Minimum form-fill time required before submit | `3` |
| `CONTACT_DUPLICATE_WINDOW_HOURS` | Duplicate message block window (same email + content hash) | `24` |
| `ADMIN_LOGIN_MAX_ATTEMPTS` | Failed admin login attempts allowed per IP before temporary block | `5` |
| `ADMIN_LOGIN_BLOCK_MINUTES` | Admin login block duration in minutes after too many failures | `15` |
| `ADMIN_LOGIN_ATTEMPT_WINDOW_MINUTES` | Rolling window used to count failed admin login attempts | `15` |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL (include `/api`) | `http://localhost:8080/api` |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for contact form CAPTCHA | unset (widget hidden) |

## Production Deployment

```bash
# Set environment variables
export POSTGRES_PASSWORD=your-secure-password
export JWT_SECRET=your-jwt-secret

# Deploy with production compose
docker-compose -f docker-compose.prod.yml up -d
```

### Vercel + Railway

1. In Vercel, set `VITE_API_URL` to your Railway backend URL, for example `https://your-service.up.railway.app/api`.
2. In Railway, set `ALLOWED_ORIGINS` to your frontend origin(s), for example `https://claytkc.dev,https://www.claytkc.dev`.
3. In Railway, set `FRONTEND_URL` to the same primary frontend origin, for example `https://claytkc.dev`.
4. Redeploy both services after updating environment variables.

## License

MIT
