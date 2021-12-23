export interface FetchSongResponse {
    title: string;
    artist: string;
    path: string;
}

export interface GenericParser {
    fetchSong(name: string): Promise<FetchSongResponse>;
    parseLyrics(path: string): Promise<string>;
}
