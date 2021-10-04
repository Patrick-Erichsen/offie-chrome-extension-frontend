import '@fontsource/montserrat';
import '@fontsource/montserrat/600.css';
import Amplify from 'aws-amplify';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material';
import amplifyConfig from './amplifyConfig';
import theme from './theme';
import App from './App';

Amplify.configure(amplifyConfig);

const rootOffieNode = document.createElement('div');
rootOffieNode.id = 'offie-node-root';

document.body.appendChild(rootOffieNode);

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
    rootOffieNode
);
