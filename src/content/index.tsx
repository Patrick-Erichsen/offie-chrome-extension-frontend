import '@fontsource/montserrat';
import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import theme from './theme';

const rootOffieNode = document.createElement('div');
rootOffieNode.id = 'offie-node-root';

document.body.appendChild(rootOffieNode);

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    rootOffieNode
);
