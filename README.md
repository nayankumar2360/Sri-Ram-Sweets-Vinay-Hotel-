# Sri-Ram-Sweets-Vinay-Hotel-

Full-Stack Direct-Ordering Web Platform for **Sri Ram Sweets (Vinay Hotel)**.

## Architecture
- **Frontend:** React (Vite) + Tailwind CSS + React Router + React Hot Toast
- **Backend:** Node.js + Express + Mongoose + JWT + Helmet + CORS
- **Database:** MongoDB Atlas

## Deployment Guide

### 1. Backend (Deploy on Render)
1. Go to [render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository: `nayankumar2360/Sri-Ram-Sweets-Vinay-Hotel-`.
3. Set the following options:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add **Environment Variables** in Render Dashboard:
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (or leave default, Render sets `PORT` automatically)
   - `MONGODB_URI` = `mongodb+srv://nayankumartechno_db_user:nayan%401234@cluster0.rxcczye.mongodb.net/shri_ram_sweets?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET` = `shri_ram_misthan_bhandar_super_secret_jwt_key_2026_dev`
   - `FRONTEND_URL` = `https://your-vercel-domain.vercel.app`

### 2. Frontend (Deploy on Vercel)
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository: `nayankumar2360/Sri-Ram-Sweets-Vinay-Hotel-`.
3. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
4. Add **Environment Variable**:
   - `VITE_API_URL` = `https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api`
5. Click **Deploy**.
