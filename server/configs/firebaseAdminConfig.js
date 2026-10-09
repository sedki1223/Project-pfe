import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the server's environment file regardless of the process working directory.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const parseServiceAccount = () => {
  const jsonFromEnvironment =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT;

  if (jsonFromEnvironment) {
    return JSON.parse(jsonFromEnvironment);
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  // Backward compatibility for an existing local credential file; never commit this file.
  const legacyCredentialPath = path.join(
    __dirname,
    "visittozeur-firebase-adminsdk-fbsvc-4b13fc1132.json"
  );
  if (fs.existsSync(legacyCredentialPath)) {
    return JSON.parse(fs.readFileSync(legacyCredentialPath, "utf8"));
  }

  throw new Error(
    "Firebase Admin configuration is missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in the server environment."
  );
};

if (!admin.apps.length) {
  const serviceAccount = parseServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { db };
