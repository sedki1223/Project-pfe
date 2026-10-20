# Visit Tozeur

Visit Tozeur is a full-stack travel and hospitality web application built around exploring Tozeur, Tunisia. It brings accommodation discovery and booking together with restaurants, food orders, transport, events, and AI-assisted trip planning.

## Live preview

[Open the deployed frontend](https://project-r87cr5mdy-sedki1223-projects.vercel.app/)

> This is the current Vercel deployment URL available for this project. Preview deployment URLs can change.

## Features

- Explore travel and accommodation options.
- Browse rooms and support booking workflows.
- Restaurant discovery, food orders, and reservations.
- Transport and event-related features.
- AI-assisted itinerary generation for trips to Tozeur.
- Authentication and role-aware management areas.
- Cloud media handling and map-related integrations.

Available functionality depends on the deployment configuration and the external services enabled for the instance.

## Tech stack

**Frontend**
- React 18 and Vite 6
- JavaScript and JSX
- Tailwind CSS 4
- React Router
- Redux Toolkit
- Clerk authentication
- Axios
- Firebase Web SDK
- Google Maps / Google OAuth integrations
- Framer Motion and Lucide React

**Backend**
- Node.js and Express 5
- MongoDB and Mongoose
- Clerk Express
- Firebase Admin SDK / Cloud Firestore
- Groq and Google generative AI integrations
- Cloudinary and Multer
- Nodemailer
- dotenv and SVIX

## Repository structure

```text
.
├── client/       # React + Vite frontend
├── server/       # Express API, routes, controllers, models, integrations
├── package.json  # Root development command
└── README.md
```

## Requirements

- Node.js and npm
- MongoDB connection
- Clerk application credentials
- Provider credentials for the integrations you want to use (for example Firebase, Cloudinary, and Groq)

## Run locally

1. Clone the repository and enter its directory.
2. Install dependencies:

   ```bash
   npm install
   npm install --prefix client
   npm install --prefix server
   ```

3. Create local environment files for the frontend and backend. See **Environment configuration** below.
4. Start the frontend and backend from the project root:

   ```bash
   npm run dev
   ```

The Vite frontend normally runs at [http://localhost:5173](http://localhost:5173). The development proxy forwards `/api` requests to the backend at `http://localhost:5000`.

You can also run each part separately in different terminals:

```bash
npm run dev --prefix client
npm run dev --prefix server
```

## Environment configuration

Create local environment files; do not commit credentials.

### `client/.env`

- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key.
- `VITE_BACKEND_URL` — backend origin for deployments; for local development, leave empty to use the Vite proxy when appropriate.
- `VITE_CURRENCY` — optional currency symbol.

Other client integrations may need public provider configuration. Values prefixed with `VITE_` are bundled into client-side code and must never contain server secrets.

### `server/.env`

- `PORT` — optional port; defaults to `5000`.
- `CLIENT_URL` — optional comma-separated list of allowed frontend origins.
- `MONGODB_URI` — MongoDB connection string.
- `CLERK_SECRET_KEY` — Clerk server-side secret.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials.
- `GROQ_API_KEY` — Groq API key.
- Firebase Admin credentials, supplied using the environment variable format supported by the server configuration.

Additional integrations may require their own environment variables. Configure production values in the hosting provider rather than committing them to the repository.

## Available scripts

| Location | Command | Purpose |
| --- | --- | --- |
| Project root | `npm run dev` | Starts the backend and frontend together |
| `client/` | `npm run dev` | Starts the Vite development server |
| `client/` | `npm run build` | Builds the frontend |
| `client/` | `npm run lint` | Runs ESLint |
| `client/` | `npm run preview` | Serves the built frontend locally |
| `server/` | `npm start` | Starts the API with Node.js |
| `server/` | `npm run dev` | Starts the API with Nodemon |
| `server/` | `npm run sync:clerk-users` | Runs the Clerk user synchronization script |

## Security notes

- Never commit `.env` files, service-account JSON files, API keys, private keys, or authentication tokens.
- Rotate any credentials that may have been committed or exposed previously.
- Restrict provider keys and database access where possible.
- Treat uploaded media and runtime data separately from source code.

## Project status

This repository contains the project source code. A successful local setup or deployment requires valid environment configuration and access to the external services used by the application. Not every integration is guaranteed to be available in every environment.
