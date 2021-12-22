import { Genius } from '../../src/classes/genius';

describe('Genius static methods', () => {
    describe('fetchSong()', () => {
        it('should return correct info', async () => {
            const song = await Genius.fetchSong('Дискотека социофобов');

            expect(song.title).toBe('Дискотека социофобов (Disco socialphobes)');
            expect(song.artist).toBe('hawaiian sadness');
        });

        it('should throw an error', async () => {
            expect(await Genius.fetchSong('arshranrhltrjtdanesttttttd')).toThrow();
        });
    });

    describe('parseLyrics()', () => {
        it('should return correct info', async () => {
            const lyrics = await Genius.parseLyrics('https://genius.com/Starset-my-demons-lyrics');

            expect(lyrics).not.toBe('');
            // Html tags.. ?
            expect(lyrics).not.toContain('<');
            expect(lyrics).not.toContain('>');
            expect(lyrics).not.toContain('&#x27;');
        });
    });
});
