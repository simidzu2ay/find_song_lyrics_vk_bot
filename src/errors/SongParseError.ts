export class SongParseError extends Error {
    constructor() {
        super('Maybe because the website got an update');
        this.name = 'SongParseError';
    }
}
