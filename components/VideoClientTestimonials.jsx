import { Suspense } from "react";
import ShortVideoClientTestimonials from "./ShortVideoClientTestimonials";
import { getAllVideoReviews } from "@/app/lib/videoReviews";

// Server wrapper for the client video testimonials strip: the reviews are read on the server so
// the client names and roles are part of the HTML (they used to load only after a browser fetch,
// which crawlers often never see). Wrapped in Suspense so the rest of the page never waits on it;
// the skeleton holds the space meanwhile.
async function LoadedTestimonials(props) {
  const reviews = await getAllVideoReviews();
  // null = the database couldn't be reached: the strip falls back to loading in the browser
  return <ShortVideoClientTestimonials {...props} initialVideos={reviews} />;
}

export default function VideoClientTestimonials(props) {
  return (
    <Suspense fallback={<ShortVideoClientTestimonials {...props} pending />}>
      <LoadedTestimonials {...props} />
    </Suspense>
  );
}
