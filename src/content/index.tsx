import * as React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { FILTER_CHIP_GROUP_ID } from './selectors'

const filterChips = document.getElementById(FILTER_CHIP_GROUP_ID)

const app = document.createElement('div')

app.id = 'root'

if (!filterChips) {
    throw new Error(
        `Failed to find filter chips with ID: ${FILTER_CHIP_GROUP_ID}`
    )
}

filterChips.appendChild(app)

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)
