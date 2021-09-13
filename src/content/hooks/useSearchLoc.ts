import { useState } from 'react'

/**
 * Subscribe to changes in the search portion of the window location.
 *
 * There is no browser event that is triggered on this event, so our
 * heuristic is to monitor the three most common events that would trigger
 * a change in the search string:
 *   - 'click'
 *   - 'popstate'
 *   - 'onload'
 */
export const useSearchLoc = (): string => {
    const [search, setSearch] = useState(window.location.search)

    const events = ['click', 'popstate', 'onload']

    events.forEach((evt) =>
        window.addEventListener(evt, () => {
            setSearch(window.location.search)
        })
    )

    return search
}
