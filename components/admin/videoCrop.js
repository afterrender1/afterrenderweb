// Video cropping is done by Cloudinary at delivery time: the crop is stored in the
// video URL as a `c_crop,w_,h_,x_,y_` transformation, so the original stays untouched
// and can be re-cropped any time.

const CROP_SEGMENT = /\/video\/upload\/c_crop,w_\d+,h_\d+,x_\d+,y_\d+\//;

export const isCloudinaryVideo = (url) => /^https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\//.test(url || "");

// Removes a crop added by this tool (other transformations are left alone)
export const stripVideoCrop = (url) => (url || "").replace(CROP_SEGMENT, "/video/upload/");

export const hasVideoCrop = (url) => CROP_SEGMENT.test(url || "");

export const withVideoCrop = (url, transform) => {
    const base = stripVideoCrop(url);
    return transform ? base.replace("/video/upload/", `/video/upload/${transform}/`) : base;
};

/* `area` is react-easy-crop's croppedArea (percentages of the video), `width`/`height` the
   video's real size. Returns "" when the crop covers the whole frame (nothing to crop). */
export const cropTransform = (area, width, height) => {
    if (!area || !(width > 0) || !(height > 0)) return "";
    let w = Math.min(Math.max(Math.round((area.width / 100) * width), 2), width);
    let h = Math.min(Math.max(Math.round((area.height / 100) * height), 2), height);
    // Video encoders need even dimensions
    w -= w % 2;
    h -= h % 2;
    if (w < 2 || h < 2) return "";
    const x = Math.min(Math.max(Math.round((area.x / 100) * width), 0), width - w);
    const y = Math.min(Math.max(Math.round((area.y / 100) * height), 0), height - h);
    if (x === 0 && y === 0 && w >= width - 1 && h >= height - 1) return "";
    return `c_crop,w_${w},h_${h},x_${x},y_${y}`;
};
