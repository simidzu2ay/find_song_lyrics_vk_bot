import { Genius } from '../../src/classes/Genius';

describe('Genius static methods', () => {
    const genius = new Genius();

    describe('fetchSong()', () => {
        it('should return correct info', async () => {
            const song = await genius.fetchSong('Дискотека социофобов');

            expect(song.title).toBe('Дискотека социофобов (Disco socialphobes)');
            expect(song.artist).toBe('hawaiian sadness');
        });

        it('should throw an error', async () => {
            expect(await genius.fetchSong('arshranrhltrjtdanesttttttd')).toThrow();
        });
    });

    describe('parseLyrics()', () => {
        it('should return correct info', async () => {
            const lyrics = await genius.parseLyrics('https://genius.com/Starset-my-demons-lyrics');

            expect(lyrics).not.toBe('');
            // Html tags.. ?
            expect(lyrics).not.toContain('<');
            expect(lyrics).not.toContain('>');
            expect(lyrics).not.toContain('&#x27;');
        });
    });
});
