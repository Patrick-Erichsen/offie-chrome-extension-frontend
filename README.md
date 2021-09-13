# Offie Chrome Extension <!-- omit in toc --> 

The Offie Chrome extension allows Airbnb users to more easily find homes with fast, reliable WiFi and ergonomic workspaces.

## Table Of Contents <!-- omit in toc --> 

- [Getting Started](#getting-started)
  - [Developer Experience Notes](#developer-experience-notes)
- [Folder Structure](#folder-structure)
- [Notes](#notes)

## Getting Started

Navigate to the project directory and install dependencies.

```
$ yarn
```

Build the extension with hot reloading:

```
$ yarn start
```

The build output is written to the `dist` directory. Add this directory to Chrome as an unpacked extension:

1. Open Chrome.
2. Navigate to `chrome://extensions`.
3. Enable _Developer mode_.
4. Click _Load unpacked_.
5. Select the `dist` directory.

You should now see an extension named `Offie`. 

### Developer Experience Notes

- Background scripts run in a separate execution environment from any given page. To view console logs, visit `chrome://extensions` and click on the `Inspect views
background page` link
- Hot module reloading allows us to rebuild the extension bundle on save, but Chrome does not pick up these changes automatically. You need to manually click the refresh icon from `chrome://extensions` to pickup these changes.
  - TODO: Try out https://github.com/xpl/crx-hotreload to fix this issue 

## Folder Structure

The folder structure below is not comprehensive. It serves to highlight the unique/relevant structures for this particular project.

```bash
├── dist ## Build output directory
├── assets
│   ├── manifest.json ## Config for our extension
│   ├── img ## Logos, etc.
├── src
│   ├── background ## Build directory for our background script
│   ├── content ## Build directory for our content script
```

## Notes

- This repo is based off the boilerplate example from https://react.christmas/2020/12
- This project is not using `create-react-app`. The reason for this is that I was unable to figure out how to configure CRA to use  multiple JS entrypoint files. The only plausible solution was `react-app-rewire-multiple-entry`, but this library appears to only support HTML entrypoints.




