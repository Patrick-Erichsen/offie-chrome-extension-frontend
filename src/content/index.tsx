import '@fontsource/montserrat';
import '@fontsource/montserrat/600.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils';
import { App } from './App';
import { initAnalytics } from '../utils';

initAnalytics();

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
