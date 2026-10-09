// Self-hosted copies of the Google fonts used across the site (latin subset, files in app/fonts).
// next/font/google downloads fonts from Google at build time, which breaks the build whenever the
// build server can't get a clean response from Google. These keep the same call signature
// (`Playfair_Display({ weight, style, ... })`) so components only need to change their import;
// the options are ignored because each font already ships every weight/style the site uses.
import localFont from "next/font/local";

const playfairDisplay = localFont({
  src: [
    { path: "../fonts/playfair-display-normal-400-900.woff2", style: "normal", weight: "400 900" },
    { path: "../fonts/playfair-display-italic-400-900.woff2", style: "italic", weight: "400 900" },
  ],
  display: "swap",
});

const urbanist = localFont({
  src: "../fonts/urbanist-normal-100-900.woff2",
  weight: "100 900",
  variable: "--font-urbanist",
  display: "swap",
});

const plusJakartaSans = localFont({
  src: "../fonts/plus-jakarta-sans-normal-200-800.woff2",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/inter-normal-100-900.woff2",
  weight: "100 900",
  display: "swap",
});

const montserrat = localFont({
  src: "../fonts/montserrat-normal-100-900.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk-normal-300-700.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

const caveat = localFont({
  src: "../fonts/caveat-normal-400-700.woff2",
  weight: "400 700",
  display: "swap",
});

const michroma = localFont({
  src: "../fonts/michroma-normal-400.woff2",
  weight: "400",
  variable: "--font-michroma",
  display: "swap",
});

const poppins = localFont({
  src: [
    { path: "../fonts/poppins-normal-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/poppins-normal-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-normal-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-normal-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-normal-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/poppins-normal-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const Playfair_Display = () => playfairDisplay;
export const Urbanist = () => urbanist;
export const Plus_Jakarta_Sans = () => plusJakartaSans;
export const Inter = () => inter;
export const Montserrat = () => montserrat;
export const Space_Grotesk = () => spaceGrotesk;
export const Caveat = () => caveat;
export const Michroma = () => michroma;
export const Poppins = () => poppins;
