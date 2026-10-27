"use client";
import useSWR from "swr";

export const KEYS = {
    reviews: "/api/video-reviews",
    portfolio: "/api/portfolio",
    events: "/api/events",
    palettes: "/api/palettes",
    blogs: "/api/blog",
};

// Updates one list inside the cached response ({ success, <field> }) without refetching
export const setList = (mutate, field, fn) =>
    mutate((d) => d && { ...d, [field]: fn(d[field] || []) }, { revalidate: false });

// The cache keeps the raw API shape; `list` is just the array, and `isLoading` is
// true only while there is nothing cached yet (so revisits never flash a skeleton).
const useList = (key, field, options) => {
    const { data, error, isLoading, mutate } = useSWR(key, options);
    return { list: data?.[field] ?? [], isLoading, error, mutate };
};

export const useVideoReviews = (options) => useList(KEYS.reviews, "reviews", options);
export const usePortfolio = (options) => useList(KEYS.portfolio, "items", options);
export const useEvents = () => useList(KEYS.events, "events");
export const usePalettes = () => useList(KEYS.palettes, "palettes");
// Only fetched while the manage modal is open
export const useBlogs = (enabled) => useList(enabled ? KEYS.blogs : null, "blogs");
