import * as Rollbar from 'rollbar';

/**
 * Get Rollbar Set Up For Trace Logging
 */
export const getRollbarConfig = (): Rollbar.Configuration => {
    const accessToken = process.env.ROLLBAR_PROJECT_TOKEN;
    const environment = process.env.NODE_ENV;

    if (!accessToken) {
        console.error(`Failed to find ROLLBAR_PROJECT_TOKEN env var!`);
        return {};
    }

    if (!environment) {
        console.error(`Failed to find NODE_ENV env var!`);
        return {};
    }

    return {
        accessToken,
        environment,
        captureUncaught: true,
        captureUnhandledRejections: true,
    };
};

export const rollbar = new Rollbar(getRollbarConfig());
