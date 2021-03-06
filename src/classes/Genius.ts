import { GeniusFetchSongResponse } from './types/GeniusFetchSong';
import { FetchSongResponse, GenericParser } from './types/Generic';
import { fetch } from '../fetch';
import { SongSearchError } from '../errors/SongSearchError';

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
        if (!response.ok) throw new Error(response.statusText);

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
        if (!response.ok) throw new Error(response.statusText);

        const fetchResult = (await response.json()) as GeniusFetchSongResponse;

        if (!fetchResult) throw new SongSearchError(name);

        const hits = fetchResult.response.sections.find(s => s.type === 'top_hit')?.hits;
        if (!hits?.length) throw new SongSearchError(name);

        for (const { result, type } of hits) {
            if (type !== 'song') continue;

            return {
                title: result.title,
                // Idk why but api returns name with this symbol
                artist: result.artist_names.replace(new RegExp('???', 'gi'), ''),
                // Genius.com already add / in song.path (/song-name) as example
                path: `${Genius.BASE_URL}${result.path}`
            };
        }

        throw new SongSearchError(name);
    }
}
