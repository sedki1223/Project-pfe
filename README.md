# Visit Tozeur

Visit Tozeur is a full-stack travel and hospitality web application focused on helping users explore and plan visits to Tozeur, Tunisia. The application brings together travel itinerary generation, accommodation and room discovery, bookings, restaurants and food orders, transport, events, and role-based management features.

> Deployment: the frontend is intended for Vercel. Add the live URL after the production API origin and final deployment structure are confirmed.

## Technology stack

### Frontend
- **React 18** with **Vite 6**
- **JavaScript** and JSX
- **Tailwind CSS 4** with the Vite plugin
- **React Router** for client-side navigation
- **Redux Toolkit** and React Redux for shared state
- **Clerk** for authentication
- **Google OAuth** and Google Maps integrations
- **Axios** for API requests
- **Firebase Web SDK**
- **Framer Motion**, **Lucide React**, **React Icons**, **React Hot Toast**, and **Sonner** for interface and feedback components

### Backend
- **Node.js** with **Express 5**
- **MongoDB** with **Mongoose**
- **Clerk Express** for authentication integration
- **Firebase Admin SDK / Cloud Firestore** for AI-generated trip records
- **Groq API** for travel itinerary generation
- **Google Generative AI SDKs** for generative features
- **Cloudinary** for managed media
- **Multer** for image uploads
- **Nodemailer** for email delivery
- **Axios**, **dotenv**, and **SVIX** for API requests, environment configuration, and webhook support

## Main capabilities

- Browse travel and accommodation content.
- Discover rooms and manage room availability.
- Support hotel and restaurant registration flows.
- Handle bookings, food orders, reservations, transport, and events.
- Generate Tozeur-focused travel itineraries using an AI API and save trip results to Firestore.
- Provide authenticated and role-aware management endpoints.

The available features and integrations depend on the environment variables and external services configured for the running instance.

## Project structure

```text
.
├── client/       # React + Vite frontend
├── server/       # Express API, routes, controllers, models, and integrations
├── package.json  # Root development command
└── README.md
```

## Requirements

- Node.js and npm
- A MongoDB connection
- Clerk application credentials
- Firebase Admin credentials for the trip-generation Firestore integration
- Cloudinary credentials for media features
- A Groq API key for AI itinerary generation
- Any additional provider credentials required by the feature being used

## Local development

Install dependencies in each package:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Configure the environment variables described below, then start the frontend and backend from the repository root:

```bash
npm run dev
```

The Vite development server runs on `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:5000`. The backend uses `PORT` when set and otherwise defaults to port `5000`.

You can also start each part independently:

```bash
npm run dev --prefix client
npm run dev --prefix server
```

## Environment configuration

Never commit real secrets. Create local environment files and configure equivalent values in your deployment provider.

### Client — `client/.env`

- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key.
- `VITE_BACKEND_URL` — deployed API origin in production. For local development, it can be left empty to use the Vite `/api` proxy.
- `VITE_CURRENCY` — optional currency symbol used by the interface.

The client also contains integrations that may require provider-specific public configuration. Check the relevant integration before deploying those features.

### Server — `server/.env`

- `PORT` — optional API port; defaults to `5000`.
- `CLIENT_URL` — optional comma-separated list of allowed frontend origins for production CORS, such as the Vercel site URL. Local development at `http://localhost:5173` remains allowed.
- `MONGODB_URI` — MongoDB connection string.
- `CLERK_SECRET_KEY` — Clerk server secret used by authenticated backend integrations.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials.
- `GROQ_API_KEY` — Groq API key for itinerary generation.
- `FIREBASE_SERVICE_ACCOUNT_JSON` — optional JSON string containing the Firebase Admin service-account object; alternatively use `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`. Store credentials securely; if the private key is supplied as a single-line environment value, encode line breaks as `\\n`.

Some integrations may require additional variables. Do not put server secrets in `VITE_*` variables, because Vite exposes those values to browser code.

## Deployment

The frontend is intended for Vercel. Configure the client environment variables in the Vercel project and set `VITE_BACKEND_URL` to the HTTPS origin of the deployed backend. The Express API must be deployed separately to a Node-compatible hosting environment with its server-side environment variables configured.

Update the Vite API proxy only if the local backend port changes. The development proxy is not a production API deployment.

## Security and repository hygiene

- Keep `.env` files, service-account JSON files, and credentials out of version control.
- Use separate production credentials and restrict provider keys where supported.
- Do not log authentication tokens or private API responses.
- Uploaded files are runtime data, not source code; production media should use the configured storage service where appropriate.

## Available scripts

| Location | Command | Purpose |
| --- | --- | --- |
| Repository root | `npm run dev` | Start client and server concurrently |
| `client/` | `npm run dev` | Start Vite development server |
| `client/` | `npm run build` | Build frontend assets |
| `client/` | `npm run lint` | Run ESLint |
| `client/` | `npm run preview` | Preview the production build locally |
| `server/` | `npm start` | Start the API with Node.js |
| `server/` | `npm run dev` | Start the API with Nodemon |
| `server/` | `npm run sync:clerk-users` | Run the Clerk user synchronization script |
