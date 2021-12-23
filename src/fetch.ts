import nodeFetch, { RequestInit } from 'node-fetch';

export const fetch = (url: string, init: RequestInit = {}) =>
    nodeFetch(url, {
        ...init,
        headers: {
            'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.113 Safari/537.36',
            ...init.headers
        }
    });
