import crypto from "crypto";

export const ADMIN_COOKIE = "admin_session";

const hmac = (value, key) =>
    crypto.createHmac("sha256", key).update(value).digest("hex");

const safeEqual = (a, b) => {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

const getCredentials = () => ({
    email: process.env.NEXT_PUBLIC_SECURE_EMAIL,
    password: process.env.NEXT_PUBLIC_SECURE_PASSWORD,
});

export const checkCredentials = (email, password) => {
    const creds = getCredentials();
    if (!creds.email || !creds.password) return false;
    // Compare hashes so length differences don't leak through timingSafeEqual
    return (
        safeEqual(hmac(String(email), "email"), hmac(creds.email, "email")) &&
        safeEqual(hmac(String(password), "password"), hmac(creds.password, "password"))
    );
};

export const createSessionToken = () => {
    const { email, password } = getCredentials();
    return hmac(`admin:${email}`, password);
};

export const isValidSessionToken = (token) => {
    const { email, password } = getCredentials();
    if (!token || !email || !password) return false;
    return safeEqual(token, createSessionToken());
};
