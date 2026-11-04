import { MongoClient } from "mongodb";

// Native MongoDB client used by Better Auth (users, sessions, accounts...).
// Mongoose keeps its own connection for the site content models.
// Cached on `global` so dev hot-reloads and warm serverless invocations reuse one pool.

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("Please define MONGO_URI in .env.local");
}

let cached = global._authMongoClient;

if (!cached) {
    // The driver connects lazily on the first query, so this is safe at import time.
    cached = global._authMongoClient = new MongoClient(MONGO_URI, {
        maxPoolSize: 10,
        appName: "afterrender-auth",
    });
}

export const mongoClient = cached;

// Same database Mongoose uses: the one named in MONGO_URI (driver default otherwise).
export const authDb = mongoClient.db();

// Indexes for the auth collections. The Better Auth Mongo adapter doesn't create these
// itself. They guarantee one account per email and keep session lookups fast.
// TTL indexes let MongoDB delete expired sessions / one-time tokens automatically.
// createIndex is idempotent, so running this once per server start is cheap and safe.
const AUTH_INDEXES = [
    ["users", { email: 1 }, { unique: true, name: "email_unique" }],
    ["sessions", { token: 1 }, { unique: true, name: "token_unique" }],
    ["sessions", { userId: 1 }, { name: "userId" }],
    ["sessions", { expiresAt: 1 }, { expireAfterSeconds: 0, name: "expiresAt_ttl" }],
    ["accounts", { userId: 1 }, { name: "userId" }],
    ["accounts", { providerId: 1, accountId: 1 }, { name: "provider_account" }],
    ["verifications", { identifier: 1 }, { name: "identifier" }],
    ["verifications", { expiresAt: 1 }, { expireAfterSeconds: 0, name: "expiresAt_ttl" }],
    ["rateLimits", { key: 1 }, { unique: true, name: "key_unique" }],
];

// Skipped during `next build` so the build never needs a database connection.
if (!global._authIndexesPromise && process.env.NEXT_PHASE !== "phase-production-build") {
    global._authIndexesPromise = Promise.all(
        AUTH_INDEXES.map(([collection, keys, options]) =>
            authDb
                .collection(collection)
                .createIndex(keys, options)
                .catch((err) => console.error(`[auth] Could not create index ${collection}.${options.name}:`, err.message))
        )
    );
}
