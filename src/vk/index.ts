import { VK } from 'vk-io';
import { Genius } from '../classes/Genius.js';
import { cfg } from '../config.js';
import { SongSearchError } from '../errors/SongSearchError';
import { SongParseError } from '../errors/SongParseError';

const vk = new VK({
    token: cfg.vk.token
});

vk.updates.on('message_new', async context => {
    if (cfg.vk.allowIds.length) {
        if (context.isChat && !cfg.vk.allowIds.includes(context.senderId)) return;
        if (context.isDM && !cfg.vk.allowIds.includes(context.peerId)) return;
    }

    const commandMatch = context.text?.match(/\$song\s+(?<name>[^]+)/i);

    if (!commandMatch?.groups) return;

    const parser = new Genius();

    try {
        const songInfo = await parser.fetchSong(commandMatch.groups.name!);
        const songLyrics = `${songInfo.artist}\n${songInfo.path}\n\n` + (await parser.parseLyrics(songInfo.path));

        const match = songLyrics.match(/[^]{1,3900}/g) || [];

        for (const text of match) {
            await context.reply({
                message: text,
                dont_parse_links: 1,
                disable_mentions: 1
            });

            // ApiError 14 fix
            await new Promise(r => setTimeout(r, 500));
        }
    } catch (e) {
        if (e instanceof SongSearchError) {
            await context.reply('Not found');
        } else if (e instanceof SongParseError) {
            await context.reply('Parsing error');
        } else {
            console.log(e);
            await context.reply('Unknown error. Please check console for more info.');
        }
    }
});

vk.updates
    .start()
    .catch(console.error)
    .then(() => console.log('Started!'));
