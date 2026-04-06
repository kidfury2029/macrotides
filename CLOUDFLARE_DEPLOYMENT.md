# Macrotides - Cloudflare Deployment Guide

## Overview
This guide explains how to deploy Macrotides to Cloudflare Pages (frontend) and Cloudflare Workers (backend API).

---

## Option 1: Cloudflare Pages (Frontend Only)

If you have a separate backend hosting, you can deploy just the React frontend to Cloudflare Pages:

### Steps:

1. **Build the frontend locally:**
   ```bash
   cd frontend
   yarn install
   yarn build
   ```

2. **Deploy to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
   - Click "Create a project" → "Direct Upload"
   - Upload the `build` folder
   - Or connect your GitHub repo and set:
     - Build command: `yarn build`
     - Build output directory: `build`
     - Root directory: `frontend`

3. **Set Environment Variables in Cloudflare:**
   - Go to Settings → Environment variables
   - Add: `REACT_APP_BACKEND_URL` = your backend API URL

---

## Option 2: Full Stack with Cloudflare Workers

For a complete Cloudflare deployment, you'll need to adapt the backend for Workers:

### Backend Adaptation Required:

The current FastAPI backend needs to be converted to Cloudflare Workers format. Here's a simplified approach:

1. **Create a `wrangler.toml` in backend folder:**
   ```toml
   name = "macrotides-api"
   main = "worker.js"
   compatibility_date = "2024-01-01"
   
   [vars]
   STRIPE_API_KEY = "your_stripe_live_key"
   
   [[d1_databases]]
   binding = "DB"
   database_name = "macrotides"
   database_id = "your-database-id"
   ```

2. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

3. **Deploy:**
   ```bash
   wrangler deploy
   ```

---

## Option 3: Recommended - Hybrid Approach

For easier deployment, consider:

### Frontend on Cloudflare Pages:
- Fast, global CDN
- Free SSL
- Easy CI/CD with GitHub

### Backend on Railway/Render/Fly.io:
- Supports Python/FastAPI natively
- Easy MongoDB integration
- One-click deployment

### Steps:
1. Deploy backend to Railway:
   ```bash
   railway login
   railway init
   railway up
   ```
   Set environment variables: `MONGO_URL`, `STRIPE_API_KEY`, `CORS_ORIGINS`

2. Deploy frontend to Cloudflare Pages:
   - Set `REACT_APP_BACKEND_URL` to your Railway backend URL

---

## Environment Variables Required

### Backend (.env):
```
MONGO_URL=mongodb+srv://...
DB_NAME=macrotides
STRIPE_API_KEY=sk_live_... (get from Stripe Dashboard)
CORS_ORIGINS=https://your-domain.com
```

### Frontend:
```
REACT_APP_BACKEND_URL=https://your-api.com
```

---

## Stripe Configuration for Production

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your live API keys from Developers → API keys
3. Replace `sk_test_emergent` with your live secret key
4. Set up webhooks for payment notifications:
   - Endpoint: `https://your-api.com/api/webhook/stripe`
   - Events: `checkout.session.completed`

---

## Domain Setup (Cloudflare)

1. Add your domain to Cloudflare
2. Point DNS to Cloudflare Pages:
   - CNAME: `www` → `your-project.pages.dev`
   - CNAME: `@` → `your-project.pages.dev`
3. Enable "Full" SSL/TLS encryption

---

## Quick Deploy Checklist

- [ ] Build frontend: `cd frontend && yarn build`
- [ ] Upload to Cloudflare Pages or connect GitHub
- [ ] Set `REACT_APP_BACKEND_URL` environment variable
- [ ] Deploy backend to Railway/Render
- [ ] Set backend environment variables (MONGO_URL, STRIPE_API_KEY)
- [ ] Configure Stripe live keys
- [ ] Set up custom domain (optional)
- [ ] Test checkout flow with real card

---

## Support

For issues with:
- **Cloudflare Pages**: [Cloudflare Docs](https://developers.cloudflare.com/pages/)
- **Stripe Integration**: [Stripe Docs](https://stripe.com/docs)
- **Railway Deployment**: [Railway Docs](https://docs.railway.app/)
