import * as Rollbar from 'rollbar';

/**
 * Get Rollbar Set Up For Trace Logging
 */
export const getRollbarConfig = (): Rollbar.Configuration => {
    const rollbarToken = process.env.ROLLBAR_PROJECT_TOKEN;
    const nodeEnv = process.env.NODE_ENV;

    if (!rollbarToken) {
        console.error(`Failed to find ROLLBAR_PROJECT_TOKEN env var!`);
        return {};
    }

    if (!nodeEnv) {
        console.error(`Failed to find NODE_ENV env var!`);
        return {};
    }

    return {
        accessToken: rollbarToken,
        environment: nodeEnv,
        captureUncaught: true,
        captureUnhandledRejections: true,
    };
};

export const rollbar = new Rollbar(getRollbarConfig());
