import { FetchSongResponse, GenericParser } from './types/Generic';
import { fetch } from '../fetch';
import { SongSearchError } from '../errors/SongSearchError';
import { SongParseError } from '../errors/SongParseError';

export class TranslatedLyrics implements GenericParser {
    private static BASE_URL = 'https://translatedlyrics.ru';

    async fetchSong(name: string): Promise<FetchSongResponse> {
        const response = await fetch(`${TranslatedLyrics.BASE_URL}/search/?text=${encodeURIComponent(name)}`);
        if (!response.ok) throw new Error(response.statusText);

        const html = await response.text();

        const match = html.match(
            /<div\s+id="search"[^]+?>[^]+?<li><a[^]+?href="(?<link>[^]+?)"[^]+?><b>(?<title>[^]+?)<\/b>\s+?\((?<artist>[^]+?)\)<\/a>[^]+?<\/li>[^]+?<\/div>/i
        );

        if (!match?.groups) throw new SongSearchError(name);

        const groups = match.groups as {
            link: string;
            title: string;
            artist: string;
        };

        return {
            title: groups.title,
            artist: groups.artist,
            path: `${TranslatedLyrics.BASE_URL}${groups.link}`
        };
    }

    async parseLyrics(path: string): Promise<string> {
        const response = await fetch(path);
        if (!response.ok) throw new Error(response.statusText);

        const text = await response.text();

        const match = text.match(
            /<div\sclass="trlyrics"[^]+?>[^]+?<p>[^]+?<\/p>[^]+?<p>(?<text>[^]+?)<\/p>[^]+?<\/div>/i
        );

        if (!match?.groups) new SongParseError();

        const groups = match?.groups as {
            text: string;
        };

        return groups.text.replace(/<br\s*\/>/gi, '\n').replace(/:]/gi, ']:');
    }
}
