/* eslint-disable import/prefer-default-export */
import type { SentimentScore } from '@aws-sdk/client-comprehend';
import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
    interface Theme {
        sentiment: { [key in keyof SentimentScore]: string };
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        sentiment?: { [key in keyof SentimentScore]: string };
    }
}

export const theme = createTheme({
    typography: {
        fontFamily: [
            'Montserrat',
            'CircularStd',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    sentiment: {
        Positive: '#B0D8A4',
        Mixed: '#FEE191',
        Negative: '#E8425B',
        Neutral: '#C4C4C4',
    },
});
