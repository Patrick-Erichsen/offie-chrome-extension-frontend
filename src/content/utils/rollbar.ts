/**
 * Get Rollbar Set Up For Trace Logging
 */
export const rollbarConfig = {
    accessToken: process.env.ROLLBAR_PROJECT_TOKEN,
    environment: process.env.NODE_ENV,
    captureUncaught: true,
    captureUnhandledRejections: true,
};
