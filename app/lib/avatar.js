// Shared rules for user profile pictures stored in Cloudinary.
// Every user has exactly one avatar asset (`user-avatars/<userId>`), overwritten on each upload,
// so old pictures never pile up.

export const AVATAR_FOLDER = "user-avatars";
export const AVATAR_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"];
export const AVATAR_MAX_MB = 5;
// Cloudinary resizes on upload so we never store huge originals.
export const AVATAR_INCOMING_TRANSFORMATION = "c_limit,w_1024,h_1024";

const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const avatarPublicId = (userId) => {
    if (!SAFE_ID.test(String(userId))) throw new Error("Invalid user id");
    return `${AVATAR_FOLDER}/${userId}`;
};

// True only for this user's own avatar in our Cloudinary account, e.g.
// https://res.cloudinary.com/<cloud>/image/upload/v1712345678/user-avatars/<userId>.jpg
export const isOwnAvatarUrl = (url, userId) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    if (!cloudName || typeof url !== "string" || !SAFE_ID.test(String(userId))) return false;
    const pattern = new RegExp(
        `^https://res\\.cloudinary\\.com/${escapeRegex(cloudName)}/image/upload/(?:v\\d+/)?` +
            `${AVATAR_FOLDER}/${escapeRegex(String(userId))}\\.(?:${AVATAR_FORMATS.join("|")})$`
    );
    return pattern.test(url);
};
