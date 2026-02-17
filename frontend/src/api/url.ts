const LOCAL_DEV_API_URL = 'http://localhost:8080/api';

const isLocalDevHost = (hostname: string): boolean =>
    hostname === 'localhost' || hostname === '127.0.0.1';

const getFallbackApiUrl = (): string => {
    if (typeof window === 'undefined') {
        return LOCAL_DEV_API_URL;
    }

    return isLocalDevHost(window.location.hostname) ? LOCAL_DEV_API_URL : '/api';
};

export const normalizeApiBaseUrl = (value: string | undefined): string => {
    const trimmed = value?.trim();
    const rawBaseUrl = trimmed || getFallbackApiUrl();

    const withProtocol =
        /^https?:\/\//i.test(rawBaseUrl) || rawBaseUrl.startsWith('/')
            ? rawBaseUrl
            : `https://${rawBaseUrl}`;

    const noTrailingSlash = withProtocol.replace(/\/+$/, '');
    return noTrailingSlash.endsWith('/api') ? noTrailingSlash : `${noTrailingSlash}/api`;
};

export const getApiBaseUrl = (): string => normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export const buildApiUrl = (path: string): string => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getApiBaseUrl()}${normalizedPath}`;
};
