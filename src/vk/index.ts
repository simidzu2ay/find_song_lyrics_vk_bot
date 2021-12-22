import { VK } from 'vk-io';
import { Genius } from '../classes/genius.js';

const vk = new VK({
    token: ''
});

vk.updates.on('message_new', async context => {
    const commandMatch = context.text?.match(/\$song\s+(?<name>[^]+)/i);

    if (!commandMatch?.groups) return;

    try {
        const songInfo = await Genius.fetchSong(commandMatch.groups.name!);
        const songLyrics = await Genius.parseLyrics(songInfo.path);

        const match = songLyrics.match(/[^]{1,4000}/g) || [];

        for (let i = 0; i < match.length; i++) {
            const first = i === 0;
            const text = match[i];

            await context.reply({
                message: first ? `${songInfo.artist}\n${songInfo.path}\n\n${text}` : text,
                dont_parse_links: 1,
                disable_mentions: 1
            });
        }
    } catch (e) {
        await context.reply('Not found');
    }
});

vk.updates
    .start()
    .catch(console.error)
    .then(() => console.log('Started!'));
