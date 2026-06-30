import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("BloodBridge");

export const auth = betterAuth({
      database: mongodbAdapter(db, {
            client,
      }),

      // VERCEL_URL is auto-injected by Vercel on every deploy (preview or
      // production) and always matches the deployment's real hostname, so
      // this stays correct without manual updates after every deploy.
      trustedOrigins: [
            process.env.BETTER_AUTH_URL,
            process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
            process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
            process.env.VERCEL_PROJECT_PRODUCTION_URL
                  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
                  : null,
      ].filter(Boolean),

      emailAndPassword: {
            enabled: true,
      },

      user: {
            additionalFields: {
                  role: { defaultValue: 'Donor' },
                  status: { defaultValue: 'Active' },
                  bloodGroup: { type: 'string', required: false },
                  district: { type: 'string', required: false },
                  upazila: { type: 'string', required: false },
                  phone: { type: 'string', required: false },
                  avatarUrl: { type: 'string', required: false },
            },
      },

      socialProviders: {
            google: {
                  clientId: process.env.GOOGLE_CLIENT_ID,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
      },
});