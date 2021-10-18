import '@fontsource/montserrat';
import '@fontsource/montserrat/600.css';
import mixpanel from 'mixpanel-browser';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils';
import { App } from './App';

const mixpanelApiKey = process.env.MIXPANEL_PROJECT_TOKEN;

if (mixpanelApiKey) {
    mixpanel.init(mixpanelApiKey);
} else {
    console.error('Failed to find `MIXPANEL_PROJECT_TOKEN` env var!');
}

const rootOffieNode = document.createElement('div');
rootOffieNode.id = 'offie-node-root';

document.body.appendChild(rootOffieNode);

ReactDOM.render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </StrictMode>,
    rootOffieNode
);
