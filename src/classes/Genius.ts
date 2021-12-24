import { GeniusFetchSongResponse } from './types/GeniusFetchSong';
import { FetchSongResponse, GenericParser } from './types/Generic';
import { fetch } from '../fetch.js';

const htmlDecode = (input: string): string => {
    return input
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&#x27;/g, "'");
};

export class Genius implements GenericParser {
    private static readonly BASE_URL = 'https://genius.com';
    private static readonly PARSE_LYRICS_REGEX = /<div\sdata-lyrics-container="true".+?>(?<text>[^]+?)<\/div>/g;

    async parseLyrics(path: string): Promise<string> {
        const response = await fetch(path);
        // TODO
        if (response.status !== 200) throw new Error(response.statusText);

        const songText: string[] = [];
        const text = await response.text();

        for (const match of text.matchAll(Genius.PARSE_LYRICS_REGEX)) {
            const groups = match.groups as {
                text: string;
            };

            songText.push(groups.text.replace(/<br\s*\/>/gi, '\n').replace(/(<[^]+?>|<\/[^]+?>)/gi, ''));
        }

        return htmlDecode(songText.join('\n').replace(/\n+/, '\n'));
    }

    async fetchSong(name: string): Promise<FetchSongResponse> {
        const response = await fetch(`${Genius.BASE_URL}/api/search/multi?per_page=5&q=${encodeURIComponent(name)}`);

        // TODO: add a custom Error || handler
        if (response.status !== 200) throw new Error(response.statusText);

        const result = (await response.json()) as GeniusFetchSongResponse;

        if (!result) throw new Error(`Not found any songs by query ${name}`);

        const section = result.response.sections.find(s => s.type === 'top_hit')?.hits[0];

        if (!section) throw new Error(`Not found any songs by query ${name}`);
        if (section.type !== 'song') throw new Error(`Not found any songs by query ${name}`);

        const song = section.result;

        return {
            title: song.title,
            // Idk why but api returns name with this symbol
            artist: song.artist_names.replace(new RegExp('​', 'gi'), ''),
            // Genius.com already add / in song.path (/song-name) as example
            path: `${Genius.BASE_URL}${song.path}`
        };
    }
}
