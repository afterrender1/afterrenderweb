// Adds Cloudinary delivery transformations (auto format/quality + resize) to an
// image URL, so the browser gets a right-sized WebP/AVIF instead of the original.
// Non-Cloudinary URLs are returned unchanged.
export const cloudinaryImage = (url, { width } = {}) => {
    if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;
    const transforms = ["f_auto", "q_auto", width && `w_${width}`, width && "c_limit"].filter(Boolean).join(",");
    return url.replace("/image/upload/", `/image/upload/${transforms}/`);
};

export const cloudinarySrcSet = (url, widths) =>
    widths.map((w) => `${cloudinaryImage(url, { width: w })} ${w}w`).join(", ");
