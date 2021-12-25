export class SongSearchError extends Error {
    public readonly songName: string;

    constructor(songName: string) {
        super('Not found any songs');
        this.name = 'SongSearchError';
        this.songName = songName;
    }
}
