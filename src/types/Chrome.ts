export interface ChromeUrlUpdate {
    event: 'URL_UPDATE';
    url: string;
}

export interface ChromeUninstallUrlUpdate {
    event: 'UPDATE_UNINSTALL_URL';
    uninstallUrl: string;
}
