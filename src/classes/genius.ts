import fetch, { RequestInit } from 'node-fetch';
import { FetchSongResponse } from './types/fetchSong';

export interface GeniusSongs {
    title: string;
    artist: string;
    path: string;
}

const htmlDecode = (input: string): string => {
    return input
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&#x27;/g, "'");
};

export class Genius {
    private static readonly BASE_URL = 'https://genius.com';
    private static readonly PARSE_LYRICS_REGEX = /<div\sdata-lyrics-container="true".+?>(?<text>[^]+?)<\/div>/g;

    private static readonly FETCH_INIT: RequestInit = {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.113 Safari/537.36'
        }
    };

    static async parseLyrics(path: string): Promise<string> {
        const response = await fetch(path, this.FETCH_INIT);
        // TODO
        if (response.status !== 200) throw new Error(response.statusText);

        const songText: string[] = [];
        const text = await response.text();

        for (const match of text.matchAll(this.PARSE_LYRICS_REGEX)) {
            const groups = match.groups as {
                text: string;
            };

            songText.push(
                groups.text
                    .replace(/<br\s*\/>/gi, '\n')
                    .replace(/(<a[^]+?>|<\/a>)/gi, '')
                    .replace(/(<span[^]+?>|<\/span>)/gi, '')
                    .replace(/(<i[^]+?>|<\/i>)/gi, '')
            );
        }

        return htmlDecode(songText.join(''));
    }

    static async fetchSong(name: string): Promise<GeniusSongs> {
        const response = await fetch(
            `${this.BASE_URL}/api/search/multi?per_page=5&q=${encodeURIComponent(name)}`,
            this.FETCH_INIT
        );

        // TODO: add a custom Error || handler
        if (response.status !== 200) throw new Error(response.statusText);

        const result = (await response.json()) as FetchSongResponse;

        if (!result) throw new Error(`Not found any songs by query ${name}`);

        const song = result.response.sections.find(s => s.type === 'top_hit')?.hits[0]?.result;

        if (!song) throw new Error(`Not found any songs by query ${name}`);

        return {
            title: song.title,
            // Idk why but api returns name with this symbol
            artist: song.artist_names.replace(new RegExp('​', 'gi'), ''),
            // Genius.com already add / in song.path (/song-name) as example
            path: `${this.BASE_URL}${song.path}`
        };
    }
}
