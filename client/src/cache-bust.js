// Cache busting file - timestamp: 1750852000000
// This forces React to generate a new bundle hash
export const BUILD_TIMESTAMP = Date.now();
export const VERSION = "2.1.1";

// Force cache bust for API calls
export const cacheBustParam = () => `?cb=${Date.now()}`;

// Version check for auto-refresh
export const APP_VERSION = "2.1.1"; 