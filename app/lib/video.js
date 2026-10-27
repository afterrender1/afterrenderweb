export function isYouTubeUrl(url) {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
}

export function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
    );
    const videoId = match && match[1] ? match[1] : url;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&fs=0`;
}
