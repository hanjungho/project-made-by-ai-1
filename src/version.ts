export const VERSION = '1.0.0';
// Use build time from environment variable if available, otherwise use current time
export const BUILD_TIME = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
